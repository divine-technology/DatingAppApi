import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeWithId, User } from '../users/user.schema';
import mongoose, { Model } from 'mongoose';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';
import { LikeResponseDto } from './like.types';

export class LikeRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Like.name) private likeModel: Model<Like>
  ) {}

  async test() {
    return await 'LIKES TEST';
  }

  async getLikesByUserId(id: string): Promise<Like[]> {
    return this.likeModel.find({ users: id }).exec();
  }

  async getAllForLikes(excludedUserIds: string[], id: string): Promise<User[]> {
    return this.userModel
      .find({ _id: { $nin: excludedUserIds, $ne: id } })
      .exec();
  }

  async getBothLikes(
    id: mongoose.Types.ObjectId,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<LikeWithId>> {
    const { page, limit } = paginateDto;

    const count = await this.likeModel
      .find({
        users: { $in: id },
        status: { $in: ['liked_back'] }
      })
      .count();

    const data = await this.likeModel
      .find({
        users: { $in: id },
        status: { $in: ['liked_back'] }
      })
      .populate('users', 'firstName lastName email gender bio age')
      .select('status')
      .limit(limit)
      .skip((page - 1) * limit);

    return {
      count: count,
      page: limit < 1 ? 1 : page,
      data
    };
  }

  async getLikes(
    id: mongoose.Types.ObjectId,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<LikeWithId>> {
    const { page, limit } = paginateDto;

    const count = await this.likeModel
      .find({
        'users.0': id,
        status: { $in: ['one_liked'] }
      })
      .count();

    const data = await this.likeModel
      .find({
        'users.0': id,
        status: { $in: ['one_liked'] }
      })
      .populate('users', 'firstName lastName email gender bio age')
      .select('status')
      .limit(limit)
      .skip((page - 1) * limit);

    return {
      count: count,
      page: limit < 1 ? 1 : page,
      data
    };
  }

  async getDislikes(
    id: mongoose.Types.ObjectId,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<Like>> {
    const { page, limit } = paginateDto;

    const count = await this.likeModel
      .find({
        'users.0': id,
        status: { $in: ['disliked'] }
      })
      .count();

    const data = await this.likeModel
      .find({
        'users.0': id,
        status: { $in: ['disliked'] }
      })
      .populate('users', 'firstName lastName email gender bio age')
      .select('status')
      .limit(limit)
      .skip((page - 1) * limit);

    return {
      count: count,
      page: limit < 1 ? 1 : page,
      data
    };
  }

  async getDislikedBy(
    id: mongoose.Types.ObjectId,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<Like>> {
    const { page, limit } = paginateDto;

    const count = await this.likeModel
      .find({
        'users.1': id,
        status: { $in: ['disliked'] }
      })
      .count();

    const data = await this.likeModel
      .find({
        'users.1': id,
        status: { $in: ['disliked'] }
      })
      .populate('users', 'firstName lastName email gender bio age')
      .select('status')
      .limit(limit)
      .skip((page - 1) * limit);

    return {
      count: count,
      page: limit < 1 ? 1 : page,
      data
    };
  }

  async getLikeRequests(
    id: mongoose.Types.ObjectId,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<LikeWithId>> {
    const { page, limit } = paginateDto;

    const count = await this.likeModel
      .find({
        'users.1': id,
        status: { $in: ['one_liked'] }
      })
      .count();

    const data = await this.likeModel
      .find({
        'users.1': id,
        status: { $in: ['one_liked'] }
      })
      .populate('users', 'firstName lastName email gender bio age')
      .select('users status')
      .limit(limit)
      .skip((page - 1) * limit);

    const dataToReturn: LikeWithId[] = [];
    data.forEach((like) =>
      dataToReturn.push({
        _id: like._id,
        users: like.users,
        status: like.status
      })
    );

    return {
      count: count,
      page: limit < 1 ? 1 : page,
      data: dataToReturn
    };
  }

  async getBlocked(
    id: mongoose.Types.ObjectId,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<Like>> {
    const { page, limit } = paginateDto;

    const count = await this.likeModel
      .find({
        'users.0': id,
        status: { $in: ['blocked'] }
      })
      .count();

    const data = await this.likeModel
      .find({
        'users.0': id,
        status: { $in: ['blocked'] }
      })
      .populate('users', 'firstName lastName email gender bio age')
      .select('status')
      .limit(limit)
      .skip((page - 1) * limit);

    return {
      count: count,
      page: limit < 1 ? 1 : page,
      data
    };
  }

  async getBlockedBack(
    id: mongoose.Types.ObjectId,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<Like>> {
    const { page, limit } = paginateDto;

    const count = await this.likeModel
      .find({
        'users.0': id,
        status: { $in: ['blocked_back'] }
      })
      .count();

    const data = await this.likeModel
      .find({
        'users.0': id,
        status: { $in: ['blocked_back'] }
      })
      .populate('users', 'firstName lastName email gender bio age')
      .select('status')
      .limit(limit)
      .skip((page - 1) * limit);

    return {
      count: count,
      page: limit < 1 ? 1 : page,
      data
    };
  }

  async getBlockedBy(
    id: mongoose.Types.ObjectId,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<Like>> {
    const { page, limit } = paginateDto;

    const count = await this.likeModel
      .find({
        'users.1': id,
        status: { $in: ['blocked'] }
      })
      .count();

    const data = await this.likeModel
      .find({
        'users.1': id,
        status: { $in: ['blocked'] }
      })
      .populate('users', 'firstName lastName email gender bio age')
      .select('status')
      .limit(limit)
      .skip((page - 1) * limit);

    return {
      count: count,
      page: limit < 1 ? 1 : page,
      data
    };
  }

  async reactWithUser(like: Like): Promise<LikeWithId> {
    return await this.likeModel.create(like);
  }

  async findLike(users: string[]): Promise<LikeWithId> {
    return await this.likeModel.findOne({
      users: { $all: users }
    });
  }

  async findLikeById(id: string): Promise<Like> {
    return await this.likeModel.findById(id).populate('users', '_id firstName lastName email gender bio age');
  }

  async deleteLike(id: string): Promise<Like> {
    return await this.likeModel.findByIdAndDelete(id);
  }

  async updateReaction(id: string, like: Like): Promise<LikeWithId> {
    return await this.likeModel.findByIdAndUpdate(id, like, { new: true });
  }
}
