import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.schema';
import { ClassNode } from '@nestjs/core/inspector/interfaces/node.interface';

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

export class ResponsePaginateDto<T> {
  @ApiProperty()
  count: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  data: Array<T>;
}

export type ClassType<T = any> = new (...args: any[]) => T;
interface IPaginated {
  page?: number;
  count?: number;
}
export function PaginatedRequestDto<T extends ClassType>(ResourceCls: T) {
  class Paginated extends ResourceCls implements IPaginated {
    @ApiProperty()
    count: number;
    @ApiProperty()
    page: number;
  }
  return Paginated;
}
