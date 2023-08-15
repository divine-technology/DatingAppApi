import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangeForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @IsNotEmpty()
  forgotPasswordToken: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  confirmNewPassword: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  token: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty()
  forgotPasswordToken: string;
}
