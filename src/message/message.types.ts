import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserResponse } from '../users/user.types';

export class MessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  imageUrl: string;
}

export class MessageBodyDto {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  imageUrl: string;
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

export class MessageUserResponse {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  avatar: string;
}
export class MultipleMessagesResponseDto {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  text: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  user: MessageUserResponse;
  @ApiProperty()
  image: string;
}

// {
//   _id: 1,
//   text: 'Hello developer',
//   createdAt: new Date(),
//   user: {
//     _id: 2,
//     name: 'React Native',
//     avatar: 'https://placeimg.com/140/140/any',
//   },
// },
