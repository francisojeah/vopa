import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/modules/users/users.service';
import { verify } from 'jsonwebtoken';

@Injectable()
export class VerifyLogin implements CanActivate {
  constructor(private readonly usersService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const headers = context.switchToHttp().getRequest().headers;
    const access_token = headers['x-access-token'];

    try {
      const { id }: any = verify(access_token, process.env.JWT_SECRET);

      if (!id) return false;

      const user = await this.usersService.findOneByid(id);
      const { password, createdAt, updatedAt, ...userObject } = user.toObject();

      request.user = userObject;
    } catch (err) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
