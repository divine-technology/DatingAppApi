import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageController } from './image.controller';
import { Image, ImageSchema } from './image.schema';
import { ImageRepository } from './image.repository';
import { ImageService } from './image.service';
import { CoreModule } from '../core.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    CoreModule
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageRepository],
  exports: [ImageService]
})
export class ImageModule {}
