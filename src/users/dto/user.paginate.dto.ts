import { ApiProperty } from '@nestjs/swagger';
import { Like, Message, User } from '../user.schema';

export class PaginateDto {
  @ApiProperty({ required: false })
  page: number;
  @ApiProperty({ required: false })
  limit: number;
  @ApiProperty({ required: false })
  sort: number;
  @ApiProperty({ required: false })
  sortBy: string;
}

export interface ResponsePaginateDto {
  pages: number;
  page: number;
  data: User[];
}

export interface ResponsePaginateDtoMessages {
  pages: number;
  page: number;
  data: Message[];
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
