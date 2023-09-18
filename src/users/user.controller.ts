import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
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
import { UPDATE_USER_EXAMPLE, USER_RADIUS_EXAMPLE } from '../swagger/example';
import {
  UpdateUserDto,
  UserPaginateDto,
  UserRadiusDto,
  UserResponse
} from './user.types';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';
import { AuthUser } from '../auth/auth.types';
import { Roles } from './user.enum';
import { Auth } from '../middleware/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Auth(Roles.ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiExtraModels(User)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(User)
    }
  })
  @Delete('/delete/:id')
  async deleteUser(): Promise<User> {
    return await this.usersService.deleteById();
  }

  @Auth(Roles.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload/profile-image')
  async uploadProfileImage(
    @UploadedFile() image: Express.Multer.File
  ): Promise<User> {
    return await this.usersService.uploadProfileImage(image);
  }

  @Auth(Roles.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload/selfie-image')
  async uploadSelfieImage(
    @UploadedFile() image: Express.Multer.File
  ): Promise<User> {
    return await this.usersService.uploadSelfieImage(image);
  }

  @Auth(Roles.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload/gallery-image')
  async uploadGalleryImage(
    @UploadedFile() image: Express.Multer.File
  ): Promise<User> {
    return await this.usersService.uploadGalleryImage(image);
  }

  @Auth(Roles.ADMIN)
  @Get('/gallery')
  async getUserGallery() {
    return await this.usersService.getGallery();
  }
}
