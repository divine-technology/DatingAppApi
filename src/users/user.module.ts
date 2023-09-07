import { Global, Module, forwardRef } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserRepository } from './user.repository';
import { CoreModule } from '../core.module';
import { LikeModule } from '../like/like.module';
import { MessageModule } from '../message/message.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CoreModule,
    forwardRef(() => LikeModule),
    forwardRef(() => MessageModule)
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService]
})
export class UsersModule {}
