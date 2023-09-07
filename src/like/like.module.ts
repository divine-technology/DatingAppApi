import { Global, Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Like,
  LikeSchema,
  Message,
  MessageSchema,
  User,
  UserSchema
} from '../users/user.schema';
import { LikeController } from './like.controller';
import { LikeRepository } from './like.repository';
import { LikeService } from './like.service';
import { UsersService } from '../users/user.service';
import { UserRepository } from '../users/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from '../mailer/mailer.service';
import { MessageService } from '../message/message.service';
import { MessageRepository } from '../message/message.repository';
import { ContextService } from '../context/context.service';
import { CoreModule } from '../core.module';
import { MessageModule } from '../message/message.module';
import { UsersModule } from '../users/user.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    CoreModule,
    forwardRef(() => MessageModule),
    forwardRef(() => UsersModule)
  ],
  controllers: [LikeController],
  providers: [LikeRepository, LikeService],
  exports: [LikeService]
})
export class LikeModule {}
