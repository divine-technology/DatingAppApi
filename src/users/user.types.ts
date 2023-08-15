import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Message, User } from './user.schema';
import { PaginateDto } from '../common/pagination.dto';

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
  location: {
    type: string;
    coordinates: [number, number];
  };
  radius: number;
}

export class UpdateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
  forgotPasswordToken: string;
  forgotPasswordTimestamp: string;
  createdAccountTimestamp: string;
  location: {
    type: string;
    coordinates: number[];
  };
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
