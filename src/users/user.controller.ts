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
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.schema';
import { UpdateUserDto } from './dto/update.user.dto';
import {
  PaginateDto,
  ResponsePaginateDto,
  ResponsePaginateDtoMessages,
  UserPaginateDto
} from './dto/user.paginate.dto';
import { UserRadiusDto } from './dto/user.radius.dto';
import { MessageDto } from './dto/message.dto';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import {
  CREATE_USER_EXAMPLE,
  UPDATE_USER_EXAMPLE,
  USER_RADIUS_EXAMPLE
} from '../swagger/example';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users pagination' })
  @ApiExtraModels(User)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(User)
    }
  })
  @Get()
  async getAllUsers(
    @Query()
    paginateDto: UserPaginateDto
  ): Promise<ResponsePaginateDto> {
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

  @ApiOperation({ summary: 'Get all users in radius' })
  @ApiBody({ schema: { example: USER_RADIUS_EXAMPLE }, type: UserRadiusDto })
  @ApiExtraModels(User)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(User)
    },
    isArray: true
  })
  @Post('/radius')
  async getRadius(
    @Body()
    userRadiusDto: UserRadiusDto
  ): Promise<User[]> {
    return await this.usersService.getRadius(userRadiusDto);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiExtraModels(User)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(User)
    }
  })
  @Get('/get/:id')
  async getOneUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.getOneUser(id);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    schema: { example: CREATE_USER_EXAMPLE },
    type: CreateUserDto
  })
  @ApiExtraModels(User)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(User)
    }
  })
  @Post()
  async createUser(
    @Body()
    createUserDto: CreateUserDto
  ): Promise<{ token: string }> {
    return await this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiBody({
    schema: {
      example: UPDATE_USER_EXAMPLE
    },
    type: UpdateUserDto
    //examples: UPDATE_USER_EXAMPLE
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
