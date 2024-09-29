import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import {
  PasswordRecover,
  PasswordRecoverSchema,
} from './schemas/passwordRecover.schema';

import {
  UserEmailVerification,
  UserEmailVerificationSchema,
} from './schemas/userEmailVerification.schema';
import { GoogleStrategy } from '@/middleware/authorization/google.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PasswordRecover.name, schema: PasswordRecoverSchema },
      { name: UserEmailVerification.name, schema: UserEmailVerificationSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule],
})
export class UserModule {}
