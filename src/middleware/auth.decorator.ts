import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Roles } from '../users/user.enum';
import { AuthGuard } from './auth.guard';

export const Auth = (role: Roles) => {
  return applyDecorators(SetMetadata('roles', role), UseGuards(AuthGuard));
};
