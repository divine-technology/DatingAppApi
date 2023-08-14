import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import { PaginateDto } from '../users/dto/user.paginate.dto';
import { ReactWithUserDto, ResponsePaginateDtoLikes } from './like.types';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { Like } from '../users/user.schema';
import { isArray } from 'class-validator';
import { REACT_WITH_USER_EXAMPLE } from '../swagger/example';

@ApiTags('Like')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: 'Get all users that liked the user back' })
  @ApiExtraModels(Like)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(Like)
    },
    isArray: true
  })
  @Get('/get-both-likes/:id')
  async getBothLikes(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDtoLikes> {
    return await this.likeService.getBothLikes(id, paginateDto);
  }

  @ApiOperation({ summary: 'Get all likes from user' })
  @ApiExtraModels(Like)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(Like)
    },
    isArray: true
  })
  @Get('/get-likes/:id')
  async getLikes(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDtoLikes> {
    return await this.likeService.getLikes(id, paginateDto);
  }

  @ApiOperation({ summary: 'Get all like requests' })
  @ApiExtraModels(Like)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(Like)
    },
    isArray: true
  })
  @Get('/get-like-requests/:id')
  async getLikeRequests(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDtoLikes> {
    return await this.likeService.getLikeRequests(id, paginateDto);
  }

  @ApiOperation({ summary: 'Get all users that are blocked' })
  @ApiExtraModels(Like)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(Like)
    },
    isArray: true
  })
  @Get('/get-blocked/:id')
  async getBlocked(
    @Param('id') id: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDtoLikes> {
    return await this.likeService.getBlocked(id, paginateDto);
  }

  @ApiOperation({ summary: 'React with a user' })
  @ApiBody({
    schema: { example: REACT_WITH_USER_EXAMPLE },
    type: ReactWithUserDto
  })
  @ApiExtraModels(Like)
  @ApiResponse({
    status: 200,
    type: String
  })
  @Post('/react/:id')
  async reactWithUser(
    @Param('id') id: string,
    @Body() reactWithUserDto: ReactWithUserDto
  ): Promise<string> {
    return await this.likeService.reactWithUser(id, reactWithUserDto);
  }
}
