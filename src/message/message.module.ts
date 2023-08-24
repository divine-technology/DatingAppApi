import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Like,
  LikeSchema,
  Message,
  MessageSchema,
  User,
  UserSchema
} from '../users/user.schema';
import { LikeService } from '../like/like.service';
import { LikeRepository } from '../like/like.repository';
import { UsersService } from '../users/user.service';
import { UserRepository } from '../users/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from '../mailer/mailer.service';
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
  controllers: [MessageController],
  providers: [
    MessageRepository,
    MessageService,
    LikeService,
    LikeRepository,
    UsersService,
    UserRepository,
    MailerService,
    ContextService
  ],
  exports: [MessageRepository]
})
export class MessageModule {}
