import { Global, Logger, Module } from '@nestjs/common';
import { AppConfigService } from './config/appConfig.service';
import { ContextService } from './context/context.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from './mailer/mailer.service';

@Global()
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
    })
  ],
  providers: [
    AppConfigService,
    Logger,
    ContextService,
    JwtModule,
    MailerService
  ],
  exports: [AppConfigService, Logger, ContextService, JwtModule, MailerService]
})
export class CoreModule {}
