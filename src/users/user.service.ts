import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common';
import { User, UserWithId } from './user.schema';
import mongoose, { isValidObjectId } from 'mongoose';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../mailer/mailer.service';
import { UserPaginateDto, UserRadiusDto, UserResponse } from './user.types';
import { MessageDto } from '../message/message.types';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';
import { ContextService } from '../context/context.service';
import { LikeService } from '../like/like.service';
import { AuthUser } from '../auth/auth.types';
import { MessageService } from '../message/message.service';
import { ImageService } from '../image/image.service';

export const numberOfSalts = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly contextService: ContextService,
    @Inject(forwardRef(() => LikeService))
    private readonly likeService: LikeService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    private readonly imageService: ImageService,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) {}

  async getAllUsers(
    paginateDto: UserPaginateDto
  ): Promise<ResponsePaginateDto<UserWithId>> {
    //this.mailerService.sendMail();
    const {
      firstName,
      lastName,
      email,
      role,
      forgotPasswordToken,
      forgotPasswordTimestamp,
      createdAccountTimestamp,
      gender,
      preference,
      age,
      hobbies
    } = paginateDto;
    const whereArray = [];
    if (email) {
      whereArray.push({ email: { $regex: '.*' + email + '.*' } });
    }
    if (firstName) {
      whereArray.push({ firstName: { $regex: '.*' + firstName + '.*' } });
    }
    if (lastName) {
      whereArray.push({ lastName: { $regex: '.*' + lastName + '.*' } });
    }
    if (role) {
      whereArray.push({ role: role });
    }
    if (forgotPasswordToken) {
      whereArray.push({
        forgotPasswordToken: forgotPasswordToken
      });
    }
    if (forgotPasswordTimestamp) {
      whereArray.push({
        forgotPasswordTimestamp: { $lt: forgotPasswordTimestamp }
      });
    }
    if (createdAccountTimestamp) {
      whereArray.push({
        createdAccountTimestamp: createdAccountTimestamp
      });
    }
    if (gender) {
      whereArray.push({
        gender: gender
      });
    }
    if (preference) {
      whereArray.push({
        preference: preference
      });
    }
    if (age) {
      whereArray.push({
        age: age
      });
    }
    if (hobbies) {
      whereArray.push({
        createdAccountTimestamp: createdAccountTimestamp
      });
    }

    return await this.userRepository.getAllUsers(paginateDto, whereArray);
  }

  async getOneUser(id: string): Promise<AuthUser> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id parameter');
    }
    const res = await this.userRepository.getOneUser(id);
    if (!res) {
      throw new NotFoundException('User not found');
    }
    const dataToReturn: AuthUser = {
      _id: res._id,
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      gender: res.gender,
      age: res.age,
      bio: res.bio,
      role: res.role,
      location: res.location,
      preference: res.preference,
      createdAccountTimeStamp: res.createdAccountTimeStamp,
      hobbies: [],
      profilePicture: res.profilePicture,
      gallery: res.gallery,
      lastPictureTaken: res.lastName
    };
    return dataToReturn;
  }

  async getRadius(
    userRadiusDto: UserRadiusDto,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<UserResponse>> {
    const myUser = this.contextService.userContext.user;
    const myLikes = await this.likeService.getLikes(myUser._id.toString(), {
      page: 0,
      limit: 0,
      sort: 1,
      sortBy: '_id'
    });
    const myDislikes = await this.likeService.getDislikes(
      myUser._id.toString(),
      {
        page: 0,
        limit: 0,
        sort: 1,
        sortBy: '_id'
      }
    );
    const myBothLikes = await this.likeService.getBothLikes(
      myUser._id.toString(),
      {
        page: 0,
        limit: 0,
        sort: 1,
        sortBy: '_id'
      }
    );
    const myBlocks = await this.likeService.getBlocked(myUser._id.toString(), {
      page: 0,
      limit: 0,
      sort: 1,
      sortBy: '_id'
    });
    const myBlocksBack = await this.likeService.getBlockedBack(
      myUser._id.toString(),
      {
        page: 0,
        limit: 0,
        sort: 1,
        sortBy: '_id'
      }
    );
    const myBlocksBy = await this.likeService.getBlockedBy(
      myUser._id.toString(),
      {
        page: 0,
        limit: 0,
        sort: 1,
        sortBy: '_id'
      }
    );
    const myDislikedBy = await this.likeService.getDislikedBy(
      myUser._id.toString(),
      {
        page: 0,
        limit: 0,
        sort: 1,
        sortBy: '_id'
      }
    );

    const arrayOfIds: string[] = [];
    myBlocksBy.data.forEach((block) =>
      arrayOfIds.push(block.user._id.toString())
    );
    myDislikedBy.data.forEach((dislike) =>
      arrayOfIds.push(dislike.user._id.toString())
    );
    myBlocksBack.data.forEach((blockBack) =>
      arrayOfIds.push(blockBack.user._id.toString())
    );
    myBlocks.data.forEach((myBlock) =>
      arrayOfIds.push(myBlock.user._id.toString())
    );
    myBothLikes.data.forEach((myBothLike) =>
      arrayOfIds.push(myBothLike.user._id.toString())
    );
    myDislikes.data.forEach((myDislike) =>
      arrayOfIds.push(myDislike.user._id.toString())
    );
    myLikes.data.forEach((myLike) =>
      arrayOfIds.push(myLike.user._id.toString())
    );

    return await this.userRepository.getUsersWithinRadius(
      userRadiusDto,
      myUser,
      paginateDto,
      arrayOfIds
    );
  }

  async findUserBy(conditionArray: any[]): Promise<UserWithId> {
    return await this.userRepository.findBy(conditionArray);
  }

  async updateById(id: string, user: Omit<User, '_id'>): Promise<User> {
    return await this.userRepository.updateById(id, user);
  }

  async uploadProfileImage(image): Promise<UserWithId> {
    const imageId = (await this.imageService.uploadImage(image))._id;

    return await this.userRepository.updateById(
      this.contextService.userContext.user._id,
      { profilePicture: imageId.toString() }
    );
  }

  async deleteById(): Promise<User> {
    const userId = this.contextService.userContext.user._id;
    const likes = await this.likeService.getAllLikes(userId);

    const likeIds: mongoose.Types.ObjectId[] = [];
    likes.forEach((like) => likeIds.push(like._id));

    const deletedLikes = await this.likeService.deleteLikeByUserId(userId);
    console.log('Likes have been deleted: ', deletedLikes);

    const deletedMessages = await this.messageService.deleteManyMessages(
      likeIds
    );
    console.log('Messages have been deleted: ', deletedMessages);

    return await this.userRepository.deleteById(userId);
  }
}
