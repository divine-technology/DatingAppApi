import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { ImageFileOptions } from './image.types';
import { ImageDocument } from './image.schema';
import { ImageRepository } from './image.repository';
import mimeTypes from 'mime-types';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class ImageService {
  private s3: S3;
  constructor(
    private readonly configService: ConfigService,
    private readonly imageRepository: ImageRepository
  ) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_S3_SECRET_KET')
    });
  }
  async uploadImage(
    image: Express.Multer.File,
    options: ImageFileOptions = { path: '' }
  ): Promise<ImageDocument> {
    const extension = mimeTypes.extension(image.mimetype);
    const awsKey = `${options.path}${uuidV4()}.${extension}`;
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Body: image.buffer,
        Key: awsKey
      })
      .promise();

    return this.imageRepository.save({
      awsKey: uploadResult.Key,
      name: image.originalname,
      extension: !!extension ? extension : null,
      mimetype: image.mimetype
    });
  }

  async getSignedUrl(fileId: string): Promise<{ url: string }> {
    const file = await this.imageRepository.getById(fileId);
    const signedUrl = await this.s3.getSignedUrl('getObject', {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: file.awsKey,
      Expires: 60
    });

    return { url: signedUrl };
  }
}
