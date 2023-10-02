import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './image.schema';

@Injectable()
export class ImageRepository {
  constructor(@InjectModel(Image.name) private image: Model<ImageDocument>) {}

  async save(image: Partial<Image>): Promise<ImageDocument> {
    return this.image.create(image);
  }

  async getById(id: string): Promise<ImageDocument> {
    return this.image.findById(id);
  }

  async updateOneById(imageId: string, data: Partial<Image>) {
    return this.image.findByIdAndUpdate(imageId, data);
  }

  async activateImages(imageIds: string[]) {
    return this.image.updateMany(
      { _id: { $in: imageIds } },
      { isActive: true }
    );
  }

  async findByIds(imageIds: string[]) {
    return this.image.find({
      _id: { $in: imageIds }
    });
  }
}
