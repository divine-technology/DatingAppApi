import { InjectModel } from '@nestjs/mongoose';
import { User, UserWithId } from './user.schema';
import mongoose, { Model } from 'mongoose';
import { UserPaginateDto, UserRadiusDto, UserResponse } from './user.types';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';
import { AuthUser } from '../auth/auth.types';

export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUsers(
    paginateDto: UserPaginateDto,
    whereArray: any[]
  ): Promise<ResponsePaginateDto<UserWithId>> {
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

  async getOneUser(id: string): Promise<AuthUser> {
    return await this.userModel.findById(id);
  }

  async findBy(findBy: any[]): Promise<UserWithId> {
    return await this.userModel.findOne({ $and: [...findBy] }).exec();
  }

  async createUser(user: User): Promise<UserWithId> {
    console.log('HALLOOOOOO');
    return await this.userModel.create(user);
  }

  async updateById(id: string, user: Partial<User>): Promise<UserWithId> {
    return await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true
    });
  }

  async deleteById(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id);
  }

  async getUsersWithinRadius(
    userRadiusDto: UserRadiusDto,
    myUser: AuthUser,
    paginateDto: PaginateDto,
    arrayOfIds: mongoose.Types.ObjectId[]
  ): Promise<ResponsePaginateDto<UserResponse>> {
    const { location, radius } = userRadiusDto;
    const { page = 1, limit = 100, sort = 1, sortBy = '_id' } = paginateDto;

    const aggregationPipeline: any[] = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: location.coordinates },
          distanceField: 'distance',
          maxDistance: radius,
          spherical: true
        }
      },
      {
        $match: {
          _id: {
            $nin: [...arrayOfIds, myUser._id]
          },
          $and: [
            { preference: myUser.gender },
            { gender: myUser.preference },
            {
              age: {
                $gte: myUser.prefferedAgeFrom,
                $lte: myUser.prefferedAgeTo
              }
            }
          ]
        }
      },
      {
        $sort: { [`${sortBy}`]: Number(sort) === 1 ? 1 : -1 }
      },
      {
        $facet: {
          paginatedUsers: [
            { $skip: (Number(page) - 1) * Number(limit) },
            { $limit: Number(limit) }
          ],
          totalCount: [{ $count: 'count' }]
        }
      }
    ];

    const result = await this.userModel.aggregate(aggregationPipeline);

    const paginatedUsers: UserResponse[] =
      result[0]?.paginatedUsers.map((user: UserWithId) => {
        const userResponse: UserResponse = {
          _id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          gender: user.gender,
          preference: user.preference,
          bio: user.bio,
          age: user.age,
          hobbies: user.hobbies,
          profilePicture: user.profilePicture,
          gallery: user.gallery,
          lastPictureTaken: user.lastPictureTaken
        };
        return userResponse;
      }) || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;

    return {
      count: totalCount,
      page: limit < 1 ? 1 : Number(page),
      data: paginatedUsers
    };
  }
}
