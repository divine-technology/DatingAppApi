import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserResponse } from '../users/user.types';

export class MessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class MessageResponseDto {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  likeId: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  fromUser: Partial<UserResponse>;
  @ApiProperty()
  toUser: Partial<UserResponse>;
}
