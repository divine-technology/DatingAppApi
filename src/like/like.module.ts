import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXPIRE')
        }
      })
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Message.name, schema: MessageSchema }
    ])
  ],
  controllers: [LikeController],
  providers: [
    LikeRepository,
    LikeService,
    UsersService,
    UserRepository,
    MailerService,
    MessageRepository,
    MessageService,
    ContextService
  ],
  exports: [LikeRepository]
})
export class LikeModule {}
