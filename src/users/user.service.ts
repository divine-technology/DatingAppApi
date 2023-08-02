import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { Like, LikeWithId, Message, User, UserWithId } from './user.schema';
import mongoose, { isValidObjectId } from 'mongoose';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create.user.dto';
import { Roles } from './user.enum';
import { MailerService } from '../mailer/mailer.service';
import {
  PaginateDto,
  ResponsePaginateDto,
  ResponsePaginateDtoMessages,
  UserPaginateDto
} from './dto/user.paginate.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { UserRadiusDto } from './dto/user.radius.dto';
import { MatchStatus } from '../like/like.types';
import { MessageDto } from './dto/message.dto';

export const numberOfSalts = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) {}

  async getAllUsers(
    paginateDto: UserPaginateDto
  ): Promise<ResponsePaginateDto> {
    //this.mailerService.sendMail();
    const {
      name,
      email,
      role,
      forgotPasswordToken,
      forgotPasswordTimestamp,
      createdAccountTimestamp
    } = paginateDto;
    const whereArray = [];
    if (email) {
      whereArray.push({ email: { $regex: '.*' + email + '.*' } });
    }
    if (name) {
      whereArray.push({ name: { $regex: '.*' + name + '.*' } });
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

    return await this.userRepository.getAllUsers(paginateDto, whereArray);
  }

  /* async getAllForLikes(id: string): Promise<User[]> {
    const likes = await this.userRepository.getLikesByUserId(id);
    const excludedUserIds = likes.map((like) => like.users).flat();

    return this.userRepository.getAllForLikes(excludedUserIds, id);
  } */

  /*   async reactWithUser(
    id: string,
    reactWithUserDto: ReactWithUserDto
  ): Promise<string> {
    const { likedUserId, status } = reactWithUserDto;
    const matchArray = [id, likedUserId];
    const doesMatchExist = await this.userRepository.findLike(matchArray);
    if (!doesMatchExist) {
      const newLike = new Like();

      if (status === MatchStatus.LIKED) {
        newLike.users = [id, likedUserId];
        newLike.status = 'one_liked';
      } else if (status === MatchStatus.DISLIKED) {
        newLike.users = [id, likedUserId];
        newLike.status = 'disliked';
      } else {
        return 'Impossible scenario';
      }

      await this.userRepository.reactWithUser(newLike);
      return 'Reaction saved.';
    } else {
      //CHECK IF STATUS IS DISLIKED AND FORBID ANYTHING IF IT IS
      if (
        doesMatchExist.status === MatchStatus.DISLIKED ||
        (doesMatchExist.status === 'one_liked' &&
          doesMatchExist.users[0] === id &&
          status !== MatchStatus.BLOCKED) ||
        (doesMatchExist.status === 'liked_back' &&
          doesMatchExist.users[0] === id &&
          status !== MatchStatus.BLOCKED) ||
        (doesMatchExist.users[1] === id && status !== MatchStatus.BLOCKED) ||
        (doesMatchExist.users[1] === id &&
          status !== MatchStatus.UNBLOCKED &&
          doesMatchExist.status !== MatchStatus.BLOCKED_BACK)
      ) {
        return 'Forbidden action!';
      }
      //CHECK IF USER WHO BLOCKED TRIES TO DO ANYTHING OTHER THAN UNBLOCK
      if (
        (doesMatchExist.status === MatchStatus.BLOCKED_BACK &&
          doesMatchExist.users[1] === id &&
          status !== MatchStatus.UNBLOCKED) ||
        (doesMatchExist.status === MatchStatus.BLOCKED &&
          doesMatchExist.users[0] === id &&
          status !== MatchStatus.UNBLOCKED)
      ) {
        return 'Cannot do anything. You need to unblock the user first!';
      }
      //BLOCK CHECK
      if (
        (doesMatchExist.status === MatchStatus.BLOCKED_BACK &&
          doesMatchExist.users[0] === id) ||
        (doesMatchExist.status === MatchStatus.BLOCKED &&
          doesMatchExist.users[1] === id)
      ) {
        return 'Cannot do anything. You are blocked!';
      }
      //UNBLOCK USER
      if (
        (doesMatchExist.users[0] === id && status === MatchStatus.UNBLOCKED) ||
        (doesMatchExist.users[1] === id &&
          status === MatchStatus.UNBLOCKED &&
          doesMatchExist.status === MatchStatus.BLOCKED_BACK)
      ) {
        const like = new Like();
        like.users = [id, likedUserId];
        like.status = 'liked';
        await this.userRepository.updateReaction(
          doesMatchExist._id.toString(),
          like
        );
        return 'User unblocked.';
      }
      //LIKE/DISLIKE TWICE CHECK
      if (doesMatchExist.users[0] === id && status === MatchStatus.LIKED) {
        return 'Cannot like/dislike the same user twice.';
      } else {
        const like = new Like();
        if (status === MatchStatus.DISLIKED) {
          like.users = [id, likedUserId];
          like.status = 'disliked';
        } else if (status === MatchStatus.BLOCKED) {
          if (doesMatchExist.users[0] == id) {
            like.users = [id, likedUserId];
            like.status = 'blocked';
          } else {
            like.users = [id, likedUserId];
            like.status = 'blocked_back';
          }
        } else if (status === MatchStatus.LIKED) {
          like.users = [id, likedUserId];
          like.status = 'liked_back';
        } else {
          return 'Impossible scenario';
        }

        await this.userRepository.updateReaction(
          doesMatchExist._id.toString(),
          like
        );
        return 'User saved (Updated).';
      }
    }
  } */

  async sendMessage(likeId: string, messageDto: MessageDto): Promise<void> {
    const { from, to, message } = messageDto;
    const doesConversationExist = await this.userRepository.findMessage(likeId);
    const findLike = await this.userRepository.findLikeById(likeId);

    const arr = [from, to];

    if (!doesConversationExist) {
      if (
        findLike.status === MatchStatus.ONE_LIKED &&
        arr.includes(findLike.users[0].toString()) &&
        arr.includes(findLike.users[1].toString())
      ) {
        if (message === 'test url' && arr[0] === findLike.users[0].toString()) {
          const newMessage = {
            likeId: Object(likeId),
            from,
            to,
            message
          };
          const test = await this.userRepository.createMessage(newMessage);
          console.log(test);
        } else {
          throw new UnauthorizedException('Not a picture! / Cannot do that!');
        }
      } else {
        throw new UnauthorizedException('1');
      }
    } else if (doesConversationExist) {
      if (findLike.status === MatchStatus.ONE_LIKED) {
        const count = await this.userRepository.countMessages(likeId);
        if (count < 2 && doesConversationExist.from === from) {
          const newMessage = {
            likeId: Object(likeId),
            from,
            to,
            message
          };
          const test = await this.userRepository.createMessage(newMessage);
          console.log(test);
        } else {
          throw new UnauthorizedException('Cannot send more than 2 messages!');
        }
      } else if (findLike.status === MatchStatus.LIKED_BACK) {
        const messages = await this.userRepository.getFirstFiveMessages(likeId);
        const count = await this.userRepository.countMessages(likeId);
        let doesMessageExist = false;
        messages.forEach((message) => {
          if (message.from === from) {
            doesMessageExist = true;
            return;
          }
        });

        if (count <= 2 && doesMessageExist === false) {
          if (message === 'test url') {
            const newMessage = {
              likeId: Object(likeId),
              from,
              to,
              message
            };
            const test = await this.userRepository.createMessage(newMessage);
            console.log(test);
          } else {
            throw new UnauthorizedException('Not a picture!');
          }
        } else {
          const newMessage = {
            likeId: Object(likeId),
            from,
            to,
            message
          };
          const test = await this.userRepository.createMessage(newMessage);
          console.log(test);
        }
      } else {
        throw new UnauthorizedException('3');
      }
    } else {
      throw new UnauthorizedException('4');
    }
  }

  async getConversation(
    likeId: string,
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDtoMessages> {
    return await this.userRepository.getConversation(likeId, paginateDto);
  }

  async deleteMessages(likeId: string): Promise<string> {
    return await this.userRepository.deleteMessages(likeId);
  }

  async getPhotoLinks(whereArray: any[]): Promise<Message[]> {
    return await this.userRepository.getPhotoLinks(whereArray);
  }

  async getOneUser(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id parameter');
    }
    const res = await this.userRepository.getOneUser(id);
    if (!res) {
      throw new NotFoundException('User not found');
    }
    return res;
  }

  async createUser(user: CreateUserDto): Promise<{ token: string }> {
    const { email, password } = user;
    const lowercaseEmail = email.toLowerCase();
    const conditionArray = [];
    conditionArray.push({ email });
    const existingUser = await this.userRepository.findBy(conditionArray);
    if (existingUser != null) {
      throw new ConflictException('Email already exists!');
    } else {
      const hashedPassword = await bcrypt.hash(password, numberOfSalts);
      const newUser = {
        ...user,
        email: lowercaseEmail,
        password: hashedPassword,
        role: Roles.ADMIN,
        forgotPasswordToken: null,
        forgotPasswordTimestamp: null,
        createdAccountTimestamp: new Date().toISOString(),
        location: {
          type: 'Point',
          coordinates: [43.85643, 18.413029]
        }
      };
      const finalUser = await this.userRepository.createUser(newUser);
      const token = this.jwtService.sign({ id: finalUser._id });
      return { token };
    }
  }

  async getRadius(userRadiusDto: UserRadiusDto): Promise<User[]> {
    return await this.userRepository.getUsersWithinRadius(userRadiusDto);
  }

  async findUserBy(conditionArray: any[]): Promise<UserWithId> {
    return await this.userRepository.findBy(conditionArray);
  }

  async updateById(id: string, user: Omit<User, '_id'>): Promise<User> {
    return await this.userRepository.updateById(id, user);
  }

  async deleteById(id: string): Promise<User> {
    return await this.userRepository.deleteById(id);
  }
}
