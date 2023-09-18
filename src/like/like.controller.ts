import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResponseDto, ReactWithUserDto } from './like.types';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { Like, LikeWithId } from '../users/user.schema';
import { isArray } from 'class-validator';
import { REACT_WITH_USER_EXAMPLE } from '../swagger/example';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';
import { Auth } from '../middleware/auth.decorator';
import { Roles } from '../users/user.enum';

@ApiTags('Like')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: 'Get all users that liked the user back' })
  @ApiExtraModels(ResponsePaginateDto<Like>)
  @ApiResponse({
    status: 200,
    type: ResponsePaginateDto<Like>
  })
  @Get('/get-both-likes/:id')
  async getBothLikes(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<LikeResponseDto>> {
    return await this.likeService.getBothLikes(id, paginateDto);
  }

  @ApiOperation({ summary: 'Get all likes from user' })
  @ApiExtraModels(Like)
  @ApiResponse({
    status: 200,
    type: Like,
    isArray: true
  })
  @Get('/get-all-likes/:id')
  async getAllLikes(@Param('id') id: string): Promise<LikeWithId[]> {
    return await this.likeService.getAllLikes(id);
  }

  @ApiOperation({ summary: 'Get likes from user' })
  @ApiExtraModels(ResponsePaginateDto<Like>)
  @ApiResponse({
    status: 200,
    type: ResponsePaginateDto<Like>
  })
  @Get('/get-likes/:id')
  async getLikes(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<LikeResponseDto>> {
    return await this.likeService.getLikes(id, paginateDto);
  }

  @ApiOperation({ summary: 'Get all dislikes from user' })
  @ApiExtraModels(ResponsePaginateDto<Like>)
  @ApiResponse({
    status: 200,
    type: ResponsePaginateDto<Like>
  })
  @Get('/get-dislikes/:id')
  async getDislikes(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<LikeResponseDto>> {
    return await this.likeService.getDislikes(id, paginateDto);
  }

  @ApiOperation({ summary: 'Get all like requests' })
  @ApiExtraModels(ResponsePaginateDto<Like>)
  @ApiResponse({
    status: 200,
    type: ResponsePaginateDto<Like>
  })
  @Get('/get-like-requests/:id')
  async getLikeRequests(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<Like>> {
    return await this.likeService.getLikeRequests(id, paginateDto);
  }

  @ApiOperation({ summary: 'Get all users that are blocked' })
  @ApiExtraModels(ResponsePaginateDto<Like>)
  @ApiResponse({
    status: 200,
    type: ResponsePaginateDto<Like>
  })
  @Get('/get-blocked/:id')
  async getBlocked(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<LikeResponseDto>> {
    return await this.likeService.getBlocked(id, paginateDto);
  }

  @Auth(Roles.ADMIN)
  @ApiOperation({ summary: 'React with a user' })
  @ApiBody({
    examples: REACT_WITH_USER_EXAMPLE,
    type: ReactWithUserDto
  })
  @ApiExtraModels(Like)
  @ApiResponse({
    status: 200,
    type: String
  })
  @Post('/react/')
  async reactWithUser(
    @Body() reactWithUserDto: ReactWithUserDto
  ): Promise<string> {
    return await this.likeService.reactWithUser(reactWithUserDto);
  }

  @Auth(Roles.ADMIN)
  @ApiOperation({ summary: 'Block a user' })
  @ApiResponse({
    status: 200,
    type: String
  })
  @Post('/block/:likeId')
  async blockByLikeId(@Param('likeId') likeId: string): Promise<string> {
    return await this.likeService.blockById(likeId);
  }
}
