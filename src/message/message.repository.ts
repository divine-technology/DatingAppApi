import { InjectModel } from '@nestjs/mongoose';
import { FADILMRZITYPESCRIPT, Message } from '../users/user.schema';
import { Model } from 'mongoose';
import {
  PaginateDto,
  ResponsePaginateDtoMessages
} from '../users/dto/user.paginate.dto';

export class MessageRepository {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>
  ) {}

  test() {
    return 'MESSAGE TEST';
  }

  async createMessage(message: Message): Promise<Message> {
    return await this.messageModel.create(message);
  }

  async findMessage(likeId: string): Promise<FADILMRZITYPESCRIPT> {
    return await this.messageModel
      .findOne({ likeId: likeId })
      .populate('likeId', 'status');
  }

  async countMessages(likeId: string): Promise<number> {
    return await this.messageModel.find({ likeId: likeId }).count();
  }

  async getFirstFiveMessages(likeId: string): Promise<Message[]> {
    return await this.messageModel.find({ likeId: likeId }).limit(5);
  }

  async getConversation(
    likeId: string,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDtoMessages> {
    const { page, limit } = paginateDto;

    const count = await this.countMessages(likeId);
    let numberOfPages: number;
    if (limit < 1) {
      numberOfPages = 1;
    } else {
      numberOfPages = Math.ceil(count / limit);
    }

    const data = await this.messageModel
      .find({
        likeId: likeId
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    return {
      pages: numberOfPages,
      page: limit < 1 ? 1 : page,
      data
    };
  }

  async getPhotoLinks(whereArray: any[]): Promise<Message[]> {
    return await this.messageModel
      .find({
        $and: [...whereArray]
      })
      .select('message');
  }

  async deleteMessages(likeId: string): Promise<string> {
    try {
      await this.messageModel.deleteMany({ likeId: likeId });
      return 'Messages deleted';
    } catch {
      throw new Error('Unable to delete messages!');
    }
  }
}
