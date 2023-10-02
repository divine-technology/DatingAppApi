import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './appConfig.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `envs/.env.${process.env.NODE_ENV || 'local'}`,
      isGlobal: true
    })
  ],
  providers: [AppConfigService, ConfigService],
  exports: [AppConfigService]
})
export class AppConfigModule {}
