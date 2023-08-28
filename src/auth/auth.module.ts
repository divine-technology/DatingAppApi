import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Like,
  LikeSchema,
  Message,
  MessageSchema,
  User,
  UserSchema
} from '../users/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '../users/user.service';
import { UserRepository } from '../users/user.repository';
import { MailerService } from '../mailer/mailer.service';
import { ContextService } from '../context/context.service';
import { LikeService } from '../like/like.service';
import { LikeRepository } from '../like/like.repository';

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
  controllers: [AuthController],
  providers: [
    AuthRepository,
    AuthService,
    UsersService,
    LikeService,
    ContextService,
    UserRepository,
    LikeRepository,
    MailerService
  ],
  exports: [AuthRepository]
})
export class AuthModule {}
