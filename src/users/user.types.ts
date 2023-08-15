import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Location, Message, User } from './user.schema';
import { PaginateDto, PaginatedRequestDto } from '../common/pagination.dto';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class UserRadiusDto {
  @ApiProperty()
  location: Location;
  @ApiProperty()
  radius: number;
}

export class UpdateUserDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  forgotPasswordToken: string;
  @ApiProperty()
  forgotPasswordTimestamp: string;
  @ApiProperty()
  createdAccountTimestamp: string;
  @ApiProperty()
  location: Location;
}

export class UserPaginateDto extends PaginateDto {
  @ApiProperty({ required: false })
  name: string;
  @ApiProperty({ required: false })
  email: string;
  @ApiProperty({ required: false })
  role: string;
  @ApiProperty({ required: false })
  forgotPasswordToken: string;
  @ApiProperty({ required: false })
  forgotPasswordTimestamp: string;
  @ApiProperty({ required: false })
  createdAccountTimestamp: string;
}

export class PaginatedUser extends PaginatedRequestDto(User) {}
