import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Message } from '../users/user.schema';
import { SEND_MESSAGE_EXAMPLE } from '../swagger/example';
import {
  MessageDto,
  MessageResponseDto,
  MultipleMessagesResponseDto
} from './message.types';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';
import { Roles } from '../users/user.enum';
import { Auth } from '../middleware/auth.decorator';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: 'Send message' })
  @ApiExtraModels(Message)
  @ApiBody({ examples: SEND_MESSAGE_EXAMPLE, type: MessageDto })
  @ApiResponse({
    status: 200,
    type: Message
  })
  @Post('/send-message/:likeId')
  async sendMessage(
    @Param('likeId') likeId: string,
    @Body() messageDto: MessageDto
  ): Promise<Message> {
    return await this.messageService.sendMessage(likeId, messageDto);
  }

  @ApiOperation({ summary: 'Get messages between users' })
  @ApiExtraModels(ResponsePaginateDto<Message>)
  @ApiResponse({
    status: 200,
    type: ResponsePaginateDto<Message>
  })
  @Get('/get-conversation/:likeId')
  async getConversation(
    @Param('likeId') likeId: string,
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<MultipleMessagesResponseDto>> {
    return await this.messageService.getConversation(likeId, paginateDto);
  }

  @Auth(Roles.ADMIN)
  @ApiOperation({ summary: 'Get all chats that a user has' })
  @ApiExtraModels(ResponsePaginateDto<MessageResponseDto>)
  @ApiResponse({
    status: 200,
    type: ResponsePaginateDto<MessageResponseDto>
  })
  @Get('/get-chats')
  async getChat(
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<MessageResponseDto>> {
    return await this.messageService.getChats(paginateDto);
  }

  @Auth(Roles.ADMIN)
  @ApiOperation({ summary: 'Get all like request chats that a user has' })
  @ApiExtraModels(ResponsePaginateDto<MessageResponseDto>)
  @ApiResponse({
    status: 200,
    type: ResponsePaginateDto<MessageResponseDto>
  })
  @Get('/get-request-chats')
  async getLikeRequestChats(
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<MessageResponseDto>> {
    return await this.messageService.getLikeRequestChats(paginateDto);
  }

  @Auth(Roles.ADMIN)
  @ApiOperation({
    summary:
      'Do not delete or use this! It was made just for getting the DTO for api client!'
  })
  @ApiExtraModels(MessageResponseDto)
  @ApiResponse({
    status: 200,
    type: MessageResponseDto
  })
  @Get('/test-dont-use')
  async testDontUse(): Promise<void> {
    console.log('Do not use this or you will be fired! :D');
  }
}
