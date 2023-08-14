import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './auth.types';
import { ForgotPasswordDto } from './auth.types';
import { ChangeForgotPasswordDto } from './auth.types';
import { ChangePasswordDto } from './auth.types';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { User } from '../users/user.schema';
import {
  CHANGE_FORGOT_PASSWORD_EXAMPLE,
  CHANGE_PASSWORD_EXAMPLE,
  LOGIN_USER_EXAMPLE
} from '../swagger/example';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ schema: { example: LOGIN_USER_EXAMPLE }, type: LoginUserDto })
  @ApiResponse({
    status: 200,
    type: String
  })
  @Post('/login')
  async loginUser(
    @Body()
    loginUserDto: LoginUserDto
  ): Promise<{ token: string }> {
    return await this.authService.loginUser(loginUserDto);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @ApiBody({ schema: { example: 'test@mail.com' }, type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    type: String
  })
  @Post('/forgot-password')
  async forgotPassword(
    @Body()
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<string> {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Change forgot password' })
  @ApiBody({
    schema: { example: CHANGE_FORGOT_PASSWORD_EXAMPLE },
    type: ChangeForgotPasswordDto
  })
  @ApiResponse({
    status: 200,
    type: String
  })
  @Post('/change-forgot-password')
  async changeForgotPassword(
    @Body()
    changeForgotPasswordDto: ChangeForgotPasswordDto
  ): Promise<string> {
    return await this.authService.changeForgotPassword(changeForgotPasswordDto);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiBody({
    schema: { example: CHANGE_PASSWORD_EXAMPLE },
    type: ChangePasswordDto
  })
  @ApiResponse({
    status: 200,
    type: String
  })
  @Put('change-password')
  async updatePassword(
    @Body()
    changePasswordDto: ChangePasswordDto
  ): Promise<string> {
    return await this.authService.changePassword(changePasswordDto);
  }
}
