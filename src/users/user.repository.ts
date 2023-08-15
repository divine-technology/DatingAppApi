import { InjectModel } from '@nestjs/mongoose';
import {
  FADILMRZITYPESCRIPT,
  Like,
  LikeWithId,
  Message,
  User,
  UserWithId
} from './user.schema';
import mongoose, { Model } from 'mongoose';
import { UserPaginateDto, UserRadiusDto } from './user.types';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';

export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Message.name) private messageModel: Model<Message>
  ) {}

  async getAllUsers(
    paginateDto: UserPaginateDto,
    whereArray: any[]
  ): Promise<ResponsePaginateDto<User>> {
    const { limit, page, sort, sortBy } = paginateDto;
    const whereCondition =
      whereArray.length > 0
        ? {
            $and: [...whereArray]
          }
        : {};
    const count = await this.userModel.find(whereCondition).count();

    const data = await this.userModel
      .find(whereCondition)
      .sort({ [`${sortBy}`]: sort === 1 ? 1 : -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    return {
      count: count,
      page: limit < 1 ? 1 : page,
      data
    };
  }

  async findLikeById(id: string): Promise<Like> {
    return await this.likeModel.findById(id);
  }

  /* async getAllForLike(id: string): Promise<User[]> {
    const fetchedUser = await this.userModel
      .findById(id)
      .select('likes.userId dislikes.userId');

    const excludedUserIds = [
      ...fetchedUser.likes.map((like) => like.userId),
      ...fetchedUser.dislikes.map((dislike) => dislike.userId)
    ];

    return await this.userModel.find({
      _id: { $ne: id, $nin: excludedUserIds }
    });
  }

  async likeUser(id: string, likedUserId: string): Promise<string> {
    await this.userModel.findByIdAndUpdate(id, {
      $push: { likes: { userId: likedUserId } }
    });
    return 'User liked!';
  }

  async dislikeUser(id: string, dislikedUserId: string): Promise<string> {
    await this.userModel.findByIdAndUpdate(id, {
      $push: { dislikes: { userId: dislikedUserId } }
    });
    return 'User disliked!';
  } */

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

  async getOneUser(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async findBy(findBy: any[]): Promise<UserWithId> {
    return await this.userModel.findOne({ $and: [...findBy] }).exec();
  }

  async createUser(user: User): Promise<UserWithId> {
    return await this.userModel.create(user);
  }

  async updateById(id: string, user: Omit<User, '_id'>): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true
    });
  }

  async deleteById(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id);
  }

  async getUsersWithinRadius(userRadiusDto: UserRadiusDto): Promise<User[]> {
    const { location, radius } = userRadiusDto;

    const users = await this.userModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: location.coordinates },
          distanceField: 'distance',
          maxDistance: radius,
          spherical: true
        }
      }
    ]);

    return users;
  }
}
