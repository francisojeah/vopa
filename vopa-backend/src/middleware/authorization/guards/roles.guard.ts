import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../../modules/users/users.service';
import { Role } from '../../../modules/users/interfaces/user.interfaces';
import { ROLES_KEY } from '../roles.decorator';
import jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const headers = context.switchToHttp().getRequest().headers;
    const request = context.switchToHttp().getRequest();
    const access_token = headers['x-access-token'];
    const { id }: any = jwt.verify(access_token, process.env.JWT_SECRET);

    const { password, createdAt, updatedAt, ...user } = (
      await this.userService.findOneByid(id)
    ).toObject();

    request.user = user;
    const role = requiredRoles.some((userRole) => userRole === user.roles[0]);

    return role;
  }
}
