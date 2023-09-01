import { InjectModel } from '@nestjs/mongoose';
import { FADILMRZITYPESCRIPT, Message, MessageWithDate } from '../users/user.schema';
import mongoose, { Model, mongo } from 'mongoose';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';
import { MessageResponseDto, MultipleMessagesResponseDto } from './message.types';

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
    const like = new mongoose.Types.ObjectId(likeId);
    return await this.messageModel
      .findOne({ likeId: like })
      .populate('likeId', 'status');
  }

  async countMessages(likeId: string): Promise<number> {
    const like = new mongoose.Types.ObjectId(likeId);
    return await this.messageModel.find({ likeId: like }).count();
  }

  async getFirstFiveMessages(likeId: string): Promise<Message[]> {
    const like = new mongoose.Types.ObjectId(likeId);
    return await this.messageModel.find({ likeId: like }).limit(5);
  }

  async getConversation(
    likeId: string,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<Message>> {
    const likeIdObj = new mongoose.Types.ObjectId(likeId)
    const { page, limit } = paginateDto;

    const count = await this.countMessages(likeId);

    const data = await this.messageModel
      .find<MessageWithDate>({
        likeId: likeIdObj
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('from to');

    return {
      count: count,
      page: limit < 1 ? 1 : page,
      data
    };
  }

  async getChats(
    userId: mongoose.Types.ObjectId,
    paginateDto: PaginateDto,
    likeRequestIds: mongoose.Types.ObjectId[],
    likeIds: mongoose.Types.ObjectId[]
  ): Promise<ResponsePaginateDto<MessageResponseDto>> {
    const { page = 1, limit = 10 } = paginateDto;
  
    const latestMessages = await this.messageModel.aggregate([
      {
        $match: {
          likeId: { $in: likeIds }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $group: {
          _id: '$likeId',
          latestMessage: { $first: '$$ROOT' }
        }
      },
      {
        $match: {
          'latestMessage.likeId': { $nin: likeRequestIds }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'latestMessage.from',
          foreignField: '_id',
          as: 'fromUser'
        }
      },
      {
        $lookup: {
          from: 'likes',
          localField: 'latestMessage.likeId',
          foreignField: '_id',
          as: 'likesData'
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'likesData.users',
          foreignField: '_id',
          as: 'usersData'
        },
      },
      {
        $addFields: {
          fromUser: { $arrayElemAt: ['$fromUser', 0] }
        }
      },
      {
        $addFields: {
          likesData: { $arrayElemAt: ['$likesData', 0] }
        }
      },
      {
        $addFields: {
          usersData: '$usersData' 
        }
      },
      {
        $skip: (Number(page) - 1) * Number(limit)
      },
      {
        $limit: Number(limit)
      }
    ]);
  
    const totalCount = latestMessages.length;
  
    const messagesWithSelectedFields: MessageResponseDto[]= latestMessages.map((message) => ({
      _id: message.latestMessage._id,
      likeId: message.latestMessage.likeId,
      fromUser: {
        _id: message.fromUser._id,
        firstName: message.fromUser.firstName,
        lastName: message.fromUser.lastName,
        role: message.fromUser.role,
        gender: message.fromUser.gender,
        age: message.fromUser.age
      },
      toUser: {
        _id: message.fromUser._id.toString() === message.usersData[0]._id.toString() ? message.usersData[1]._id.toString() : message.usersData[0]._id.toString(),
        firstName: message.fromUser._id.toString() === message.usersData[0]._id.toString() ? message.usersData[1].firstName : message.usersData[0].firstName,
        lastName: message.fromUser._id.toString() === message.usersData[0]._id.toString() ? message.usersData[1].lastName : message.usersData[0].lastName,
        role: message.fromUser._id.toString() === message.usersData[0]._id.toString() ? message.usersData[1].role : message.usersData[0].role,
        gender: message.fromUser._id.toString() === message.usersData[0]._id.toString() ? message.usersData[1].gender : message.usersData[0].gender,
        age: message.fromUser._id.toString() === message.usersData[0]._id.toString() ? message.usersData[1].age : message.usersData[0].age
      },
      message: message.latestMessage.message,
      createdAt: message.latestMessage.createdAt,
      updatedAt: message.latestMessage.updatedAt
    }));
  
    return {
      count: totalCount,
      page: limit < 1 ? 1 : Number(page),
      data: messagesWithSelectedFields
    };
  }
  

  async getLikeRequestChats(
    userId: mongoose.Types.ObjectId,
    paginateDto: PaginateDto,
    likeRequestIds: mongoose.Types.ObjectId[]
  ): Promise<ResponsePaginateDto<MessageResponseDto>> {
    const { page = 1, limit = 10 } = paginateDto;
  
    const latestMessages = await this.messageModel.aggregate([
      {
        $match: {
          likeId: { $in: likeRequestIds }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $group: {
          _id: '$likeId',
          latestMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'latestMessage.from',
          foreignField: '_id',
          as: 'fromUser'
        }
      },
      {
        $lookup: {
          from: 'likes',
          localField: 'latestMessage.likeId',
          foreignField: '_id',
          as: 'likesData'
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'likesData.users',
          foreignField: '_id',
          as: 'usersData'
        },
      },
      {
        $addFields: {
          fromUser: { $arrayElemAt: ['$fromUser', 0] }
        }
      },
      {
        $addFields: {
          likesData: { $arrayElemAt: ['$likesData', 0] }
        }
      },
      {
        $addFields: {
          usersData: '$usersData' 
        }
      },
      {
        $skip: (Number(page) - 1) * Number(limit)
      },
      {
        $limit: Number(limit)
      }
    ]);
  
    const totalCount = latestMessages.length;
  
    const messagesWithSelectedFields: MessageResponseDto[]= latestMessages.map((message) => ({
      _id: message.latestMessage._id,
      likeId: message.latestMessage.likeId,
      fromUser: {
        _id: message.fromUser._id,
        firstName: message.fromUser.firstName,
        lastName: message.fromUser.lastName,
        role: message.fromUser.role,
        gender: message.fromUser.gender,
        age: message.fromUser.age
      },
      toUser: {
        _id: message.fromUser._id.toString() === message.usersData[0]._id.toString() ? message.usersData[1]._id.toString() : message.usersData[0]._id.toString(),
        firstName: message.fromUser._id.toString() === message.usersData[0]._id.toString() ? message.usersData[1].firstName : message.usersData[0].firstName,
        lastName: message.fromUser._id.toString() === message.usersData[0]._id.toString() ? message.usersData[1].lastName : message.usersData[0].lastName,
        role: message.fromUser._id.toString() === message.usersData[0]._id.toString() ? message.usersData[1].role : message.usersData[0].role,
        gender: message.fromUser._id.toString() === message.usersData[0]._id.toString() ? message.usersData[1].gender : message.usersData[0].gender,
        age: message.fromUser._id.toString() === message.usersData[0]._id.toString() ? message.usersData[1].age : message.usersData[0].age
      },
      message: message.latestMessage.message,
      createdAt: message.latestMessage.createdAt,
      updatedAt: message.latestMessage.updatedAt
    }));
  
    return {
      count: totalCount,
      page: limit < 1 ? 1 : Number(page),
      data: messagesWithSelectedFields
    };
    // const { page = 1, limit = 10 } = paginateDto;

    // const latestMessages = await this.messageModel.aggregate([
    //   {
    //     $match: {
    //       $or: [{ from: userId }, { to: userId }]
    //     }
    //   },
    //   {
    //     $addFields: {
    //       participants: {
    //         $setUnion: [
    //           [{ $cond: [{ $eq: ['$from', userId] }, '$to', '$from'] }],
    //           [userId]
    //         ]
    //       }
    //     }
    //   },
    //   {
    //     $sort: {
    //       createdAt: -1
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: '$participants',
    //       latestMessage: { $first: '$$ROOT' }
    //     }
    //   },
    //   {
    //     $replaceRoot: { newRoot: '$latestMessage' }
    //   },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'from',
    //       foreignField: '_id',
    //       as: 'fromUser'
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'to',
    //       foreignField: '_id',
    //       as: 'toUser'
    //     }
    //   },
    //   {
    //     $addFields: {
    //       fromUser: { $arrayElemAt: ['$fromUser', 0] },
    //       toUser: { $arrayElemAt: ['$toUser', 0] }
    //     }
    //   },
    //   {
    //     $match: {
    //       likeId: { $in: likeRequestIds }
    //     }
    //   },
    //   {
    //     $skip: (Number(page) - 1) * Number(limit)
    //   },
    //   {
    //     $limit: Number(limit)
    //   }
    // ]);

    // const conversationCount = await this.messageModel.aggregate([
    //   {
    //     $match: {
    //       $or: [{ from: userId }, { to: userId }]
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         from: '$from',
    //         to: '$to'
    //       }
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       count: { $sum: 1 }
    //     }
    //   }
    // ]);

    // const totalCount =
    //   conversationCount.length > 0 ? conversationCount[0].count : 0;

    // const messagesWithSelectedFields = latestMessages.map((message) => ({
    //   _id: message.latestMessage._id,
    //   likeId: message.latestMessage.likeId,
    //   fromUser: {
    //     _id: message.fromUser._id,
    //     firstName: message.fromUser.firstName,
    //     lastName: message.fromUser.lastName,
    //     role: message.fromUser.role,
    //     gender: message.fromUser.gender,
    //     age: message.fromUser.age
    //   },
    //   toUser: {
    //     _id: message.toUser._id,
    //     firstName: message.toUser.firstName,
    //     lastName: message.toUser.lastName,
    //     role: message.toUser.role,
    //     gender: message.toUser.gender,
    //     age: message.toUser.age
    //   },
    //   message: message.message,
    //   createdAt: message.createdAt,
    //   updatedAt: message.updatedAt
    // }));

    // return {
    //   count: totalCount,
    //   page: limit < 1 ? 1 : Number(page),
    //   data: messagesWithSelectedFields
    // };
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
