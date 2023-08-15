import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.schema';

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
