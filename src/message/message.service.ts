import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { LikeService } from '../like/like.service';
import { MatchStatus } from '../like/like.types';
import { Message } from '../users/user.schema';
import { MessageDto, MessageResponseDto } from './message.types';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';
import { ContextService } from '../context/context.service';
import mongoose from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly likeService: LikeService,
    private readonly contextService: ContextService
  ) {}

  test() {
    return this.messageRepository.test();
  }

  async sendMessage(likeId: string, messageDto: MessageDto): Promise<Message> {
    const { from, to, message } = messageDto;
    const doesConversationExist = await this.messageRepository.findMessage(
      likeId
    );
    const findLike = await this.likeService.findLikeById(likeId);

    const arr = [from, to];

    if (!doesConversationExist) {
      if (
        findLike.status === MatchStatus.ONE_LIKED &&
        arr.includes(findLike.users[0].toString()) &&
        arr.includes(findLike.users[1].toString())
      ) {
        if (message === 'test url' && arr[0] === findLike.users[0].toString()) {
          const newMessage = {
            likeId: new mongoose.Types.ObjectId(likeId),
            from: new mongoose.Types.ObjectId(from),
            to: new mongoose.Types.ObjectId(to),
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
          const newMessage = {
            likeId: new mongoose.Types.ObjectId(likeId),
            from: new mongoose.Types.ObjectId(from),
            to: new mongoose.Types.ObjectId(to),
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
              to: new mongoose.Types.ObjectId(to),
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
            to: new mongoose.Types.ObjectId(to),
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
  ): Promise<ResponsePaginateDto<Message>> {
    return await this.messageRepository.getConversation(likeId, paginateDto);
  }

  async getChats(
    paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<MessageResponseDto>> {
    const userId = this.contextService.userContext.user._id;
    const likeRequests = await this.likeService.getLikeRequests(
      userId,
      paginateDto
    );
    const likeRequestIds: mongoose.Types.ObjectId[] = [];
    likeRequests.data.forEach((request) => likeRequestIds.push(request._id));
    return await this.messageRepository.getChats(
      new mongoose.Types.ObjectId(userId),
      paginateDto,
      likeRequestIds
    );
  }

  async deleteMessages(likeId: string): Promise<string> {
    return await this.messageRepository.deleteMessages(likeId);
  }

  async getPhotoLinks(whereArray: any[]): Promise<Message[]> {
    return await this.messageRepository.getPhotoLinks(whereArray);
  }
}
