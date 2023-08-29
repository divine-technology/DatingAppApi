import { InjectModel } from '@nestjs/mongoose';
import { FADILMRZITYPESCRIPT, Message } from '../users/user.schema';
import { Model } from 'mongoose';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';

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
  ): Promise<ResponsePaginateDto<Message>> {
    const { page, limit } = paginateDto;

    const count = await this.countMessages(likeId);

    const data = await this.messageModel
      .find({
        likeId: likeId
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    return {
      count: count,
      page: limit < 1 ? 1 : page,
      data
    };
  }

  async getChats(
    userId: string,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<Message>> {
    const { page = 1, limit = 10 } = paginateDto;

    const latestMessages = await this.messageModel.aggregate([
      {
        $match: {
          $or: [{ from: userId }, { to: userId }]
        }
      },
      {
        $addFields: {
          participants: {
            $setUnion: [
              [{ $cond: [{ $eq: ['$from', userId] }, '$to', '$from'] }],
              [userId]
            ]
          }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $group: {
          _id: '$participants',
          latestMessage: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$latestMessage' }
      },
      {
        $skip: (Number(page) - 1) * Number(limit)
      },
      {
        $limit: Number(limit)
      }
    ]);

    const conversationCount = await this.messageModel.aggregate([
      {
        $match: {
          $or: [{ from: userId }, { to: userId }]
        }
      },
      {
        $group: {
          _id: {
            from: '$from',
            to: '$to'
          }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);

    const totalCount =
      conversationCount.length > 0 ? conversationCount[0].count : 0;

    return {
      count: totalCount,
      page: limit < 1 ? 1 : Number(page),
      data: latestMessages
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
