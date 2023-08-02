import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import { PaginateDto } from '../users/dto/user.paginate.dto';
import { ReactWithUserDto, ResponsePaginateDtoLikes } from './like.types';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get()
  async test() {
    return await this.likeService.test();
  }

  @Get('/get-both-likes/:id')
  async getBothLikes(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDtoLikes> {
    return await this.likeService.getBothLikes(id, paginateDto);
  }

  @Get('/get-likes/:id')
  async getLikes(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDtoLikes> {
    return await this.likeService.getLikes(id, paginateDto);
  }

  @Get('/get-like-requests/:id')
  async getLikeRequests(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDtoLikes> {
    return await this.likeService.getLikeRequests(id, paginateDto);
  }

  @Get('/get-blocked/:id')
  async getBlocked(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDtoLikes> {
    return await this.likeService.getBlocked(id, paginateDto);
  }

  @Post('/react/:id')
  async reactWithUser(
    @Param('id') id: string,
    @Body() reactWithUserDto: ReactWithUserDto
  ): Promise<string> {
    return await this.likeService.reactWithUser(id, reactWithUserDto);
  }
}
