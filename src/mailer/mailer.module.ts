import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { MailerService } from './mailer.service';
dotenv.config();

@Module({
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule {}
