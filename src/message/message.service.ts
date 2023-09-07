import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef
} from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { LikeService } from '../like/like.service';
import { MatchStatus } from '../like/like.types';
import {
  Like,
  Message,
  MessageWithDate,
  UserWithId
} from '../users/user.schema';
import {
  MessageBodyDto,
  MessageDto,
  MessageResponseDto,
  MultipleMessagesResponseDto
} from './message.types';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';
import { ContextService } from '../context/context.service';
import mongoose from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    @Inject(forwardRef(() => LikeService))
    private readonly likeService: LikeService,
    private readonly contextService: ContextService
  ) {}

  test() {
    return this.messageRepository.test();
  }

  async sendMessage(
    likeId: string,
    messageDto: MessageBodyDto
  ): Promise<Message> {
    const { message } = messageDto;
    const doesConversationExist = await this.messageRepository.findMessage(
      likeId
    );
    const findLike = await this.likeService.findLikeById(likeId);

    const from = this.contextService.userContext.user._id;

    if (!doesConversationExist) {
      if (
        findLike.status === MatchStatus.ONE_LIKED &&
        findLike.users[0]._id.toString() === from
      ) {
        if (
          message === 'test url' &&
          from === findLike.users[0]._id.toString()
        ) {
          const newMessage: Message = {
            likeId: new mongoose.Types.ObjectId(likeId),
            from: new mongoose.Types.ObjectId(from),
            message
          };
          const test = await this.messageRepository.createMessage(newMessage);
          return test;
        } else {
          throw new UnauthorizedException('Not a picture! / Cannot do that!');
        }
      } else {
        throw new UnauthorizedException('1');
      }
    } else if (doesConversationExist) {
      if (findLike.status === MatchStatus.ONE_LIKED) {
        const count = await this.messageRepository.countMessages(likeId);
        if (count < 2 && doesConversationExist.from.toString() === from) {
          const newMessage: Message = {
            likeId: new mongoose.Types.ObjectId(likeId),
            from: new mongoose.Types.ObjectId(from),
            message
          };
          const test = await this.messageRepository.createMessage(newMessage);
          return test;
        } else {
          throw new UnauthorizedException('Cannot send more than 2 messages!');
        }
      } else if (findLike.status === MatchStatus.LIKED_BACK) {
        const messages = await this.messageRepository.getFirstFiveMessages(
          likeId
        );
        const count = await this.messageRepository.countMessages(likeId);
        let doesMessageExist = false;
        messages.forEach((message) => {
          if (message.from.toString() === from) {
            doesMessageExist = true;
            return;
          }
        });

        if (count <= 2 && doesMessageExist === false) {
          if (message === 'test url') {
            const newMessage = {
              likeId: new mongoose.Types.ObjectId(likeId),
              from: new mongoose.Types.ObjectId(from),
              message
            };
            const test = await this.messageRepository.createMessage(newMessage);
            console.log(test);
            return test;
          } else {
            throw new UnauthorizedException('Not a picture!');
          }
        } else {
          const newMessage = {
            likeId: new mongoose.Types.ObjectId(likeId),
            from: new mongoose.Types.ObjectId(from),
            message
          };
          const test = await this.messageRepository.createMessage(newMessage);
          console.log(test);
          return test;
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
  ): Promise<ResponsePaginateDto<MultipleMessagesResponseDto>> {
    const data = await this.messageRepository.getConversation(
      likeId,
      paginateDto
    );
    const messageData = data.data as unknown as MessageWithDate[];

    const dataToReturn: MultipleMessagesResponseDto[] = [];

    messageData.forEach((message) => {
      dataToReturn.push({
        _id: message._id.toString(),
        text: message.message,
        createdAt: message.createdAt,
        user: {
          _id: (message.from as unknown as UserWithId)._id.toString(),
          name:
            (message.from as unknown as UserWithId).firstName +
            ' ' +
            (message.from as unknown as UserWithId).lastName,
          avatar:
            'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
        }
      });
    });

    return {
      count: data.count,
      page: data.page,
      data: dataToReturn
    };
  }

  async getChats(
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<MessageResponseDto>> {
    const userId = this.contextService.userContext.user._id;
    const likeRequests = await this.likeService.getLikeRequests(
      userId,
      paginateDto
    );

    const likes = await this.likeService.getLikes(userId, paginateDto);
    const bothLikes = await this.likeService.getBothLikes(userId, paginateDto);

    const likeIds: mongoose.Types.ObjectId[] = [];
    likes.data.forEach((like) => likeIds.push(like._id));
    bothLikes.data.forEach((like) => likeIds.push(like._id));

    const likeRequestIds: mongoose.Types.ObjectId[] = [];
    likeRequests.data.forEach((request) => likeRequestIds.push(request._id));

    const data = await this.messageRepository.getChats(
      new mongoose.Types.ObjectId(userId),
      paginateDto,
      likeRequestIds,
      likeIds
    );

    return data;
  }

  async getLikeRequestChats(
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<MessageResponseDto>> {
    const userId = this.contextService.userContext.user._id;
    const likeRequests = await this.likeService.getLikeRequests(
      userId,
      paginateDto
    );
    const likeRequestIds: mongoose.Types.ObjectId[] = [];
    likeRequests.data.forEach((request) => likeRequestIds.push(request._id));
    return await this.messageRepository.getLikeRequestChats(
      new mongoose.Types.ObjectId(userId),
      paginateDto,
      likeRequestIds
    );
  }

  async getBlockedChats(
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<MessageResponseDto>> {
    const userId = this.contextService.userContext.user._id;
    const blocked = await this.likeService.getBlocked(userId, paginateDto);

    const blockIds: mongoose.Types.ObjectId[] = [];
    blocked.data.forEach((request) => blockIds.push(request._id));

    return await this.messageRepository.getBlockedChats(
      new mongoose.Types.ObjectId(userId),
      paginateDto,
      blockIds
    );
  }

  async deleteMessages(likeId: string): Promise<string> {
    return await this.messageRepository.deleteMessages(likeId);
  }

  async deleteManyMessages(
    likeIds: mongoose.Types.ObjectId[]
  ): Promise<string> {
    return await this.messageRepository.deleteManyMessages(likeIds);
  }

  async getPhotoLinks(whereArray: any[]): Promise<Message[]> {
    return await this.messageRepository.getPhotoLinks(whereArray);
  }
}
