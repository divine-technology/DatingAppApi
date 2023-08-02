import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PasswordLength = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): boolean => {
    const req = ctx.switchToHttp().getRequest();
    const password = req?.body?.password;
    return password?.length > 3 ? true : false;
  }
);
