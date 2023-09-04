import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User, UserWithId } from './user.schema';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import {
  CREATE_USER_EXAMPLE,
  UPDATE_USER_EXAMPLE,
  USER_RADIUS_EXAMPLE
} from '../swagger/example';
import {
  CreateUserDto,
  UpdateUserDto,
  UserPaginateDto,
  UserRadiusDto,
  UserResponse
} from './user.types';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';
import { AuthUser, LoginResponseDto } from '../auth/auth.types';
import { Roles } from './user.enum';
import { Auth } from '../middleware/auth.decorator';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users pagination' })
  @ApiExtraModels(ResponsePaginateDto<UserWithId>)
  @ApiResponse({
    status: 200,
    type: ResponsePaginateDto<UserWithId>
  })
  @Get()
  async getAllUsers(
    @Query()
    paginateDto: UserPaginateDto
  ): Promise<ResponsePaginateDto<UserWithId>> {
    return await this.usersService.getAllUsers(paginateDto);
  }

  /* @Get('/for-like/:id')
  async getAllForLikes(@Param('id') id: string): Promise<User[]> {
    return await this.usersService.getAllForLikes(id);
  }

  @Put('/:id/like/:likedUserId')
  async likeUser(
    @Param('id') id: string,
    @Param('likedUserId') likedUserId: string
  ): Promise<string> {
    return await this.usersService.likeUser(id, likedUserId);
  }

  @Put('/:id/dislike/:dislikedUserId')
  async dislikeUser(
    @Param('id') id: string,
    @Param('dislikedUserId') dislikedUserId: string
  ): Promise<string> {
    return await this.usersService.dislikeUser(id, dislikedUserId);
  } */

  /* @Get('/for-like/:id')
  async getAllForLikes(@Param('id') id: string): Promise<User[]> {
    return await this.usersService.getAllForLikes(id);
  } */

  @Auth(Roles.ADMIN)
  @ApiOperation({ summary: 'Get all users in radius' })
  @ApiBody({ schema: { example: USER_RADIUS_EXAMPLE }, type: UserRadiusDto })
  @ApiExtraModels(ResponsePaginateDto<UserResponse>)
  @ApiResponse({
    status: 200,
    type: ResponsePaginateDto<UserResponse>
  })
  @Post('/radius')
  async getRadius(
    @Body()
    userRadiusDto: UserRadiusDto,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<UserResponse>> {
    return await this.usersService.getRadius(userRadiusDto, paginateDto);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiExtraModels(UserResponse)
  @ApiResponse({
    status: 200,
    type: UserResponse
  })
  @Get('/get/:id')
  async getOneUser(@Param('id') id: string): Promise<AuthUser> {
    return await this.usersService.getOneUser(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiBody({
    examples: UPDATE_USER_EXAMPLE,
    type: UpdateUserDto
  })
  @ApiExtraModels(User)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(User)
    }
  })
  @Put('/update/:id')
  async updateUser(
    @Param('id')
    id: string,
    @Body()
    user: UpdateUserDto
  ): Promise<User> {
    return await this.usersService.updateById(id, user);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiExtraModels(User)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(User)
    }
  })
  @Delete('/delete/:id')
  async deleteUser(
    @Param('id')
    id: string
  ): Promise<User> {
    return await this.usersService.deleteById(id);
  }
}
