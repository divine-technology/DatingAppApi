import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { Image } from './image.schema';
import { Roles } from '../users/user.enum';
import { Auth } from '../middleware/auth.decorator';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Upload image' })
  @ApiBody({
    type: Object
  })
  @ApiExtraModels(Image)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(Image)
    }
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload')
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    return this.imageService.uploadImage(image);
  }

  @ApiOperation({ summary: 'Get uploaded images by id' })
  @Get('/:imageId')
  @Auth(Roles.ADMIN)
  async getSignedUrl(
    @Param('imageId') imageId: string,
    @Query('dimensions') dimensions: string
  ) {
    console.log('IMAGE ID: ', imageId);
    return this.imageService.getSignedUrl(imageId, dimensions);
  }
}
