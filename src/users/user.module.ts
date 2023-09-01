import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Like,
  LikeSchema,
  Message,
  MessageSchema,
  User,
  UserSchema
} from './user.schema';
import { UserRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '../mailer/mailer.module';
import { MailerService } from '../mailer/mailer.service';
import { ContextService } from '../context/context.service';
import { LikeService } from '../like/like.service';
import { LikeRepository } from '../like/like.repository';
import { MessageService } from '../message/message.service';
import { MessageRepository } from '../message/message.repository';

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
    ]),
    MailerModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    MailerService,
    ContextService,
    LikeService,
    LikeRepository,
    MessageService,
    MessageRepository
  ],
  exports: [UserRepository]
})
export class UsersModule {}
