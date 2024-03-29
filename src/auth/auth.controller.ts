import { Body, Controller, Get, Headers, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthResponseDto,
  AuthUser,
  ForgotPasswordResponseDto,
  LoginResponseDto,
  LoginUserDto
} from './auth.types';
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
  CREATE_USER_EXAMPLE,
  FORGOT_PASSWORD_EXAMPLE,
  LOGIN_USER_EXAMPLE
} from '../swagger/example';
import { CreateUserDto } from '../users/user.types';
import { Auth } from '../middleware/auth.decorator';
import { Roles } from '../users/user.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ examples: LOGIN_USER_EXAMPLE, type: LoginUserDto })
  @ApiResponse({
    status: 200,
    type: AuthResponseDto
  })
  @Post('/login')
  async loginUser(
    @Body()
    loginUserDto: LoginUserDto
  ): Promise<AuthResponseDto> {
    return await this.authService.loginUser(loginUserDto);
  }

  @Auth(Roles.ADMIN)
  @ApiResponse({
    status: 200,
    type: AuthUser
  })
  @ApiOperation({ summary: 'Get me' })
  @Get('/get-me')
  async getMe(): Promise<AuthUser> {
    return await this.authService.getMe();
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    examples: CREATE_USER_EXAMPLE,
    type: CreateUserDto
  })
  @ApiExtraModels(User)
  @ApiResponse({
    status: 200,
    type: AuthResponseDto
  })
  @Post('/')
  async createUser(
    @Body()
    createUserDto: CreateUserDto
  ): Promise<AuthResponseDto> {
    return await this.authService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @ApiBody({
    examples: FORGOT_PASSWORD_EXAMPLE,
    type: ForgotPasswordDto
  })
  @ApiResponse({
    status: 200,
    type: ForgotPasswordResponseDto
  })
  @Post('/forgot-password')
  async forgotPassword(
    @Body()
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<ForgotPasswordResponseDto> {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Change forgot password' })
  @ApiBody({
    examples: CHANGE_FORGOT_PASSWORD_EXAMPLE,
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
    examples: CHANGE_PASSWORD_EXAMPLE,
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
