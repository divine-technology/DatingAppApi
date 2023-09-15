import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { ImageFileOptions, ImageResponseDto } from './image.types';
import { ImageDocument } from './image.schema';
import { ImageRepository } from './image.repository';
import mimeTypes from 'mime-types';
import { v4 as uuidV4 } from 'uuid';
import { ContextService } from '../context/context.service';
import sharp from 'sharp';

@Injectable()
export class ImageService {
  private s3: S3;
  constructor(
    private readonly configService: ConfigService,
    private readonly contextService: ContextService,
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
    const uuid = uuidV4();
    const extension = mimeTypes.extension(image.mimetype);
    const awsKey = `${options.path}${uuid}.${extension}`;
    const awsKey300 = `${options.path}${uuid}300x300.${extension}`;
    const awsKey800 = `${options.path}${uuid}800x800.${extension}`;

    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Body: image.buffer,
        Key: `${this.contextService.userContext.user._id}/${awsKey}`
      })
      .promise();

    this.s3
      .upload({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Body: await sharp(image.buffer)
          .resize({ width: 300, height: 300 })
          .toBuffer(),
        Key: `${this.contextService.userContext.user._id}/${awsKey300}`
      })
      .promise();

    this.s3
      .upload({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Body: await sharp(image.buffer)
          .resize({ width: 800, height: 800 })
          .toBuffer(),
        Key: `${this.contextService.userContext.user._id}/${awsKey800}`
      })
      .promise();

    return this.imageRepository.save({
      awsKey: uploadResult.Key,
      name: image.originalname,
      extension: !!extension ? extension : null,
      mimetype: image.mimetype
    });
  }

  async uploadMessageImage(
    image: Express.Multer.File,
    options: ImageFileOptions = { path: '' },
    likeId: string
  ): Promise<ImageDocument> {
    const uuid = uuidV4();
    const extension = mimeTypes.extension(image.mimetype);
    const awsKey = `${options.path}${uuid}.${extension}`;
    const awsKey300 = `${options.path}${uuid}300x300.${extension}`;
    const awsKey800 = `${options.path}${uuid}800x800.${extension}`;

    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Body: image.buffer,
        Key: `${likeId}/${awsKey}`
      })
      .promise();

    this.s3
      .upload({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Body: await sharp(image.buffer)
          .resize({ width: 300, height: 300 })
          .toBuffer(),
        Key: `${likeId}/${awsKey300}`
      })
      .promise();

    this.s3
      .upload({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Body: await sharp(image.buffer)
          .resize({ width: 800, height: 800 })
          .toBuffer(),
        Key: `${likeId}/${awsKey800}`
      })
      .promise();

    return this.imageRepository.save({
      awsKey: uploadResult.Key,
      name: image.originalname,
      extension: !!extension ? extension : null,
      mimetype: image.mimetype
    });
  }

  async getSignedUrl(
    fileId: string,
    dimensions?: string
  ): Promise<ImageResponseDto> {
    const file = await this.imageRepository.getById(fileId);
    console.log({ file });
    const awsKey = `${file.awsKey.substring(0, file.awsKey.lastIndexOf('.'))}${
      dimensions ?? ''
    }${file.awsKey.substring(file.awsKey.lastIndexOf('.'))}`;
    console.log({
      awsKey
    });
    const signedUrl = await this.s3.getSignedUrl('getObject', {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: awsKey,
      Expires: 60
    });

    return {
      url: signedUrl,
      createdAt: (file as any).createdAt
    };
  }
}
