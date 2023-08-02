import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './auth.types';
import { ForgotPasswordDto } from './auth.types';
import { ChangeForgotPasswordDto } from './auth.types';
import { ChangePasswordDto } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async test() {
    return await this.authService.test();
  }

  @Post('/login')
  async loginUser(
    @Body()
    loginUserDto: LoginUserDto
  ): Promise<{ token: string }> {
    return await this.authService.loginUser(loginUserDto);
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Body()
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<string> {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/change-forgot-password')
  async changeForgotPassword(
    @Body()
    changeForgotPasswordDto: ChangeForgotPasswordDto
  ): Promise<string> {
    return await this.authService.changeForgotPassword(changeForgotPasswordDto);
  }

  @Put('change-password')
  async updatePassword(
    @Body()
    changePasswordDto: ChangePasswordDto
  ): Promise<string> {
    return await this.authService.changePassword(changePasswordDto);
  }
}
