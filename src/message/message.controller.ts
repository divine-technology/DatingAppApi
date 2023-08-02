import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDto } from '../users/dto/message.dto';
import {
  PaginateDto,
  ResponsePaginateDtoMessages
} from '../users/dto/user.paginate.dto';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { Message } from '../users/user.schema';
import { SEND_MESSAGE_EXAMPLE } from '../swagger/example';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: 'Send message' })
  @ApiExtraModels(Message)
  @ApiBody({ schema: { example: SEND_MESSAGE_EXAMPLE } })
  @Post('/send-message/:likeId')
  async sendMessage(
    @Param('likeId') likeId: string,
    @Body() messageDto: MessageDto
  ): Promise<void> {
    return await this.messageService.sendMessage(likeId, messageDto);
  }

  @ApiOperation({ summary: 'Get messages between users' })
  @ApiExtraModels(Message)
  @Get('/get-conversation/:likeId')
  async getConversation(
    @Param('likeId') likeId: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDtoMessages> {
    return await this.messageService.getConversation(likeId, paginateDto);
  }
}
