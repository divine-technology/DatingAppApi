import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDto } from '../users/dto/message.dto';
import {
  PaginateDto,
  ResponsePaginateDtoMessages
} from '../users/dto/user.paginate.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  test() {
    return this.messageService.test();
  }

  @Post('/send-message/:likeId')
  async sendMessage(
    @Param('likeId') likeId: string,
    @Body() messageDto: MessageDto
  ): Promise<void> {
    return await this.messageService.sendMessage(likeId, messageDto);
  }

  @Get('/get-conversation/:likeId')
  async getConversation(
    @Param('likeId') likeId: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDtoMessages> {
    return await this.messageService.getConversation(likeId, paginateDto);
  }
}
