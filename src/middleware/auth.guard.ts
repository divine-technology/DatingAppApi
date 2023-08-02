import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../users/user.enum';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
    private userService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<Roles>('roles', context.getHandler());

    const req = await context.switchToHttp().getRequest();
    const headers = req.headers.authorization;

    if (headers.includes('Bearer ')) {
      const info = headers.split('Bearer ');
      if (info.length > 1 && info[1]) {
        try {
          const verify = await this.jwtService.verify(info[1]);
          const user = await this.userService.getOneUser(verify.id);

          if (user.role != Roles.ADMIN && user.role != role) {
            console.log('Roles are not matching');
            throw new UnauthorizedException();
          }
        } catch (error) {
          throw new UnauthorizedException();
        }
      } else throw new UnauthorizedException();
    } else {
      throw new UnauthorizedException();
    }

    return true;
  }
}
