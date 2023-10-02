import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
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
  MessageBodyDto,
  MessageResponseDto,
  MultipleMessagesResponseDto
} from './message.types';
import { PaginateDto, ResponsePaginateDto } from '../common/pagination.dto';
import { Roles } from '../users/user.enum';
import { Auth } from '../middleware/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Auth(Roles.ADMIN)
  @ApiOperation({ summary: 'Send message' })
  @ApiExtraModels(Message)
  @ApiBody({ examples: SEND_MESSAGE_EXAMPLE, type: MessageBodyDto })
  @ApiResponse({
    status: 200,
    type: Message
  })
  @Post('/send-message/:likeId')
  async sendMessage(
    @Param('likeId') likeId: string,
    @Body() messageDto: MessageBodyDto
  ): Promise<Message> {
    return await this.messageService.sendMessage(likeId, messageDto);
  }

  @Auth(Roles.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload-message-image/:likeId')
  async uploadMessageImage(
    @Param('likeId') likeId: string,
    @UploadedFile() image: Express.Multer.File
  ): Promise<string> {
    return await this.messageService.uploadMessageImage(image, likeId);
  }

  @Auth(Roles.ADMIN)
  @ApiOperation({ summary: 'Send image message' })
  @UseInterceptors(FileInterceptor('image'))
  @Post('/send-image-message/:likeId')
  async sendImageMessage(
    @Param('likeId') likeId: string,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Message> {
    return await this.messageService.sendImageMessage(likeId, image);
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
  @ApiOperation({ summary: 'Get users that are blocked by the user' })
  @ApiExtraModels(ResponsePaginateDto<MessageResponseDto>)
  @ApiResponse({
    status: 200,
    type: ResponsePaginateDto<MessageResponseDto>
  })
  @Get('/get-blocked-chats')
  async getBlockedChats(
    @Query() paginateDto: PaginateDto
  ): Promise<ResponsePaginateDto<MessageResponseDto>> {
    return await this.messageService.getBlockedChats(paginateDto);
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
