import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
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
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Headers('content-type') contentType: string
  ) {
    console.log('Content-Type Header:', contentType);
    console.log('Uploaded Image:', image);
    // return this.imageService.uploadImage(image);
  }

  @ApiOperation({ summary: 'Get uploaded images by id' })
  @Get('/:imageId')
  async getSignedUrl(@Param('imageId') imageId: string) {
    return this.imageService.getSignedUrl(imageId);
  }
}
