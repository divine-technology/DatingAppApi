import { Like, Message, User } from '../user.schema';

export interface PaginateDto {
  page: number;
  limit: number;
  sort: number;
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

export interface UserPaginateDto extends PaginateDto {
  name: string;
  email: string;
  role: string;
  forgotPasswordToken: string;
  forgotPasswordTimestamp: string;
  createdAccountTimestamp: string;
}
