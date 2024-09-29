import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import HttpStatusCodes from 'src/configurations/HttpStatusCodes';
import { PasswordRecover } from './schemas/passwordRecover.schema';
import { AuthProps, Role, UserProps } from './interfaces/user.interfaces';
import { UserEmailVerification } from './schemas/userEmailVerification.schema';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import axios from 'axios';
import { MailService } from '../mail/mail.service';

const jwt = require('jsonwebtoken');
const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    private readonly mailService: MailService,
    private configService: ConfigService,

    @InjectModel(User.name) private userModel: Model<User>,

    @InjectModel(UserEmailVerification.name)
    private userEmailVerificationModel: Model<UserEmailVerification>,

    @InjectModel(PasswordRecover.name)
    private passwordRecoverModel: Model<PasswordRecover>,
  ) {}

  async create(createUserDto: CreateUserDto, roles: Role[]): Promise<any> {
    const createdUser = new this.userModel({ ...createUserDto, roles });

    const hash = await bcrypt.hash(createdUser.password, saltOrRounds);
    createdUser.password = hash;

    const savedUser = await createdUser.save();
    return savedUser;
  }

  async login(loginDto: LoginUserDto, user: UserProps): Promise<any> {
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) return { msg: 'Invalid credentials', status: false };

    const token = jwt.sign(
      { id: user.id },
      this.configService.get('JWT_SECRET'),
      { expiresIn: this.configService.get('JWT_TIME') },
    );

    return {
      token,
      msg: 'Login successful',
      status: true,
    };
  }

  async getNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://accounts.google.com/o/oauth2/token',
        {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to refresh the access token.');
    }
  }

  async getProfile(token: string) {
    try {
      return axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );

      const expiresIn = response.data.expires_in;

      if (!expiresIn || expiresIn <= 0) {
        return true;
      }
    } catch (error) {
      return true;
    }
  }

  async revokeGoogleToken(token: string) {
    try {
      await axios.get(
        `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }

  async findOneByEmail(email: string): Promise<UserProps> {
    const user = await this.userModel.findOne<UserProps>({ email }).exec();
    return user;
  }

  async findOneByid(id: string): Promise<UserProps> {
    const user = await this.userModel
      .findOne<UserProps>({ _id: id })
      .exec();

    return user;
  }

  async findAll() {
    const user = await this.userModel.find<UserProps>();
    return user;
  }

  async findNonExistingEmails(emails: string[]) {
    const foundUsers = await this.userModel
      .find({ email: { $in: emails } })
      .exec();

    const foundEmails = foundUsers.map((user) => user.email);

    const notFoundEmails = emails.filter(
      (email) => !foundEmails.includes(email),
    );

    return notFoundEmails;
  }

  async createUserEmailToken(userData: UserProps): Promise<any> {
    const { email, firstname } = userData;
    if (!email) return { msg: 'No email specified' };

    const user = await this.userModel.findOne<UserProps>({ email });
    if (!user) return { msg: 'Invalid user', user: null };

    if (user.isVerified)
      return { msg: 'email is already verified', verified: true };

    const emailToken = (Math.floor(Math.random() * 900000) + 100000).toString();

    const emailVerification = await this.userEmailVerificationModel
      .findOne({ user: new Types.ObjectId(user.id) })
      .exec();

    if (!emailVerification) {
      //create a verification email record
      await this.createEmailRecord(userData, emailToken);

      await this.mailService.sendUserVerificationEmail(userData, emailToken);
    } else {
      const currentTime = Date.now();
      // @ts-ignore
      const createdAtTime = emailVerification.createdAt.getTime();
      const timeDifferenceInMinutes =
        (currentTime - createdAtTime) / (1000 * 60);
      const isLessThan15Minutes = timeDifferenceInMinutes < 2;

      if (isLessThan15Minutes) {
        return { msg: 'Try again in 2 minutes', token: false };
      } else {
        if (emailVerification.isVerified)
          return { msg: 'Account is verified', account: true };

        const obj = this.userEmailVerificationModel
          .updateOne(
            { user: new Types.ObjectId(userData.id) },
            {
              $set: {
                emailToken,
              },
            },
          )
          .exec();

        //send the verification link to email address

        await this.mailService.sendUserVerificationEmail(userData, emailToken);

        return { msg: 'verification mail sent to email address', token: false };
      }
    }
  }

  async createEmailRecord(user: UserProps, emailToken: string): Promise<any> {
    const newEmailRecord = new this.userEmailVerificationModel({
      emailToken,
      user,
    });

    return await newEmailRecord.save();
  }

  async verifyEmailToken(emailToken: string) {
    if (!emailToken) return { msg: 'no token specified' };

    const emailData = await this.userEmailVerificationModel.findOne({
      emailToken,
    });

    if (!emailData) return { msg: 'Invalid verification code' };

    // @ts-ignore
    const objectId = new Types.ObjectId(emailData.user);
    const user = await this.userModel.findById<UserProps>(objectId).exec();

    if (!user) return { msg: 'Bad Request' };

    if (user.isVerified) return { msg: 'User is already verified' };

    if (emailData && emailData.isVerified)
      return { msg: 'Email is already verified' };

    await this.userEmailVerificationModel
      .updateOne(
        { emailToken },
        {
          $set: {
            emailToken: '',
            isVerified: true,
          },
        },
      )
      .exec();

    await this.userModel.updateOne<UserProps>(
      { email: user.email },
      {
        $set: { isVerified: true },
      },
    );

    return {
      isVerified: true,
      msg: 'You have been verified',
    };
  }

  async createResetPasswordRecord(user: UserProps, code: string): Promise<any> {
    const newEmailRecord = new this.passwordRecoverModel({ code, user });

    return await newEmailRecord.save();
  }

  async createForgotPasswordCode(user: UserProps): Promise<{
    msg?: string;
    status?: number;
    sent?: boolean;
    email?: string;
  }> {
    const { email } = user;

    const newPasswordCode = (
      Math.floor(Math.random() * 900000) + 1000000
    ).toString();

    const userRecord = await this.passwordRecoverModel.findOne({
      user: new Types.ObjectId(user.id),
    });

    if (!userRecord) {
      //create password token
      this.createResetPasswordRecord(user, newPasswordCode);

      //send the rest password link to email address
      this.mailService.sendForgotPasswordEmail(email, newPasswordCode);

      return {
        msg: 'Check your email for instructions',
        status: HttpStatusCodes.OK,
        sent: true,
        email,
      };
    } else {
      const currentTime = Date.now();

      // @ts-ignore
      const createdAtTime = userRecord.createdAt.getTime();
      const timeDifferenceInMinutes =
        (currentTime - createdAtTime) / (1000 * 60);
      const isLessThan15Minutes = timeDifferenceInMinutes < 2;

      if (isLessThan15Minutes) {
        return {
          msg: 'Try again in 2 minutes',
          status: HttpStatusCodes.BAD_REQUEST,
          sent: true,
          email,
        };
      } else {
        await this.passwordRecoverModel
          .updateOne(
            { user: new Types.ObjectId(user._id) },
            { $set: { code: newPasswordCode } },
          )
          .exec();

        //send the forgot password link to email address
        this.mailService.sendForgotPasswordEmail(email, newPasswordCode);

        return {
          msg: 'Instructions sent to your email address',
          status: HttpStatusCodes.OK,
          sent: true,
          email,
        };
      }
    }
  }

  async verifyResetPasswordCode(code: string): Promise<{
    msg?: string;
    redirect?: boolean;
    statusCode?: number;
    userId?: string;
    code?: string;
  }> {
    if (!code)
      return {
        msg: 'no token specified',
        redirect: true,
      };

    const pwdData: any = await this.passwordRecoverModel.findOne({ code });

    if (!pwdData)
      return {
        msg: 'Invalid verification code',
        statusCode: HttpStatusCodes.BAD_REQUEST,
      };

    const user = await this.userModel.findById<UserProps>(
      new Types.ObjectId(pwdData.user.id),
    );

    if (!user)
      return {
        msg: 'Bad Request',
        redirect: true,
        statusCode: HttpStatusCodes.PERMANENT_REDIRECT,
      };

    // if (user.isBanned)
    //   return {
    //     msg: "You're not authorized to make this request",
    //     statusCode: HttpStatusCodes.UNAUTHORIZED,
    //   };

    return { userId: user.id, code: pwdData.code };
  }

  async updateUserPassword(
    data: UserProps,
  ): Promise<{ msg: string; statusCode: number }> {
    const isCodeValid = await this.passwordRecoverModel.findOne({
      code: data.code,
    });

    if (!isCodeValid.code)
      return {
        msg: 'Forbidden Request',
        statusCode: HttpStatusCodes.FORBIDDEN,
      };

    const saltOrRounds = 10;
    const newPasswordHash = await bcrypt.hash(data.password, saltOrRounds);

    const updated = await this.userModel
      .updateOne({ _id: data.id }, { password: newPasswordHash })
      .exec();

    await this.passwordRecoverModel
      .updateOne({ code: data.code }, { code: '' })
      .exec();

    if (updated.modifiedCount > 0)
      return {
        msg: 'Password updated successfully',
        statusCode: HttpStatusCodes.OK,
      };

    return {
      msg: 'Password not updated',
      statusCode: HttpStatusCodes.BAD_REQUEST,
    };
  }

  async updateUserProflie(data: UserProps, user: any) {
    return await this.userModel.updateOne({ _id: user._id }, data);
  }

  async findByIds(userIds: Types.ObjectId[]): Promise<any> {
    return await this.userModel.find(
      { _id: { $in: userIds } },
      'firstname lastname',
    );
  }

  async getUsersByIdsAndMore(userIds: string[]): Promise<User[]> {
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }

  async createRandomPassword(length: number) {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  async createUsersWithRandomPasswords(notFoundEmails: string[]) {
    const usersToCreate: AuthProps[] = [];

    for (const email of notFoundEmails) {
      const password = await this.createRandomPassword(8);

      await this.create(
        {
          email,
          password,
          cpassword: '',
        },
        [Role.User],
      );

      usersToCreate.push({ email, password });
    }

    return usersToCreate;
  }

  async findOneAndUpdateByEmail(
    id: string,
    update: Partial<User>,
  ): Promise<UserProps> {
    return this.userModel.findOneAndUpdate({ _id: id }, update, { new: true });
  }

  async loginWithGoogle(accessToken: string): Promise<any> {
    try {
      // 1. Verify the Google access token
      // Verify the Google access token
      const googleUser = await this.getProfile(accessToken);

      // Extract relevant data from the Google user profile
      const { email, given_name, family_name, picture } = googleUser.data;

      // 3. If a user with the provided email exists, log them in. Otherwise, create a new user.
      let userData = await this.findOneByEmail(email);
      if (!userData) {
        // Create a new user if not found
        const newUser: CreateUserDto = {
          email,
          password: 'GeneralPassword123', // You may want to generate a random password here
          cpassword: 'GeneralPassword123', // You may want to generate a random password here
          firstname: given_name,
          lastname: family_name,
          profileImage: picture,
        };
        userData = await this.create(newUser, [Role.User]);
        if (!userData.isVerified)
        userData = await this.findOneAndUpdateByEmail(userData._id, {
            isVerified: true,
          });
      }

      // 4. Return the logged-in user data along with an authentication token
      const loginData: LoginUserDto = { email, password: 'GeneralPassword123' };
      const loggedUser = await this.login(loginData, userData);
      const { password, createdAt, updatedAt, ...user } = userData.toObject();

      return {
        ...loggedUser,
        user,
        isAuthenticated: true,
        token: loggedUser.token,
      };
    } catch (error) {
      // If verification fails, throw an error
      throw new HttpException(
        'Invalid Google access token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
