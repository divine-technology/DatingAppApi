import { Global, Module, forwardRef } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../users/user.schema';
import { CoreModule } from '../core.module';
import { LikeModule } from '../like/like.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    CoreModule,
    forwardRef(() => LikeModule)
  ],
  controllers: [MessageController],
  providers: [MessageRepository, MessageService],
  exports: [MessageService]
})
export class MessageModule {}
