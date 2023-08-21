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
import { Request } from 'express';
import { AuthUser } from '../auth/auth.types';
import { ContextService } from '../context/context.service';
import { UserContext } from '../context/user.context';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
    private userService: UsersService,
    private readonly contextService: ContextService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<Roles>('roles', context.getHandler());

    const req = await context.switchToHttp().getRequest();
    const headers = req.headers.authorization;

    const authenticatedUser = await this.authenticateUser(headers);
    this.contextService.userContext = new UserContext(authenticatedUser);

    if (
      authenticatedUser.role != Roles.ADMIN &&
      authenticatedUser.role != role
    ) {
      console.log('Roles are not matching');
      throw new UnauthorizedException();
    }

    return true;
  }

  private async authenticateUser(token: string): Promise<AuthUser> {
    if (!token || !token.includes('Bearer ')) {
      throw new UnauthorizedException();
    }

    const realToken = token.split('Bearer ');
    if (realToken.length > 1 && realToken[1]) {
      try {
        const verify = await this.jwtService.verify(realToken[1]);
        const user = await this.userService.getOneUser(verify.id);

        if (!user) throw new UnauthorizedException();

        const dataToReturn: AuthUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAccountTimeStamp: user.createdAccountTimestamp,
          location: user.location
        };
        return dataToReturn;
      } catch (error) {
        throw new UnauthorizedException();
      }
    } else throw new UnauthorizedException();
  }
}
