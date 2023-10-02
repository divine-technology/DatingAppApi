import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidationArguments,
  ValidationOptions,
  registerDecorator
} from 'class-validator';
import { Like, User, UserWithId } from '../users/user.schema';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class ReactWithUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  likedUserId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMatchStatus()
  status: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  likedPhotoUrl: string;
}

export class LikeResponseDto {
  @ApiProperty()
  _id: mongoose.Types.ObjectId;
  @ApiProperty()
  user: Partial<UserWithId>;
  @ApiProperty()
  status: string;
}

export function IsMatchStatus(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'isMatchStatus',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          return Object.values(MatchStatus).includes(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `Invalid match status. Allowed values are: ${Object.values(
            MatchStatus
          ).join(', ')}`;
        }
      }
    });
  };
}

export class LikeWithErrorStatus {
  _id: string;
  hasErrors: boolean;
}

export enum MatchStatus {
  LIKED = 'liked',
  ONE_LIKED = 'one_liked',
  LIKED_BACK = 'liked_back',
  DISLIKED = 'disliked',
  BLOCKED = 'blocked',
  BLOCKED_BACK = 'blocked_back',
  UNBLOCKED = 'unblocked'
}
