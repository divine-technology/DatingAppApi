import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from './mailer/mailer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { LikeModule } from './like/like.module';
import { MessageModule } from './message/message.module';
import { ImageModule } from './image/image.module';
import { AppConfigModule } from './config/appConfig.module';
import { CoreModule } from './core.module';
import { AppConfigService } from './config/appConfig.service';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.dbUrl
      }),
      inject: [AppConfigService]
    }),
    CoreModule,
    UsersModule,
    MailerModule,
    ScheduleModule.forRoot(),
    AuthModule,
    LikeModule,
    MessageModule,
    ImageModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
