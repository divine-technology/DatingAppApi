import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env() {
    return this.configService.get('NODE_ENV');
  }

  get port() {
    return parseInt(this.configService.get('PORT'), 10) || 8000;
  }

  get dbUrl() {
    return this.configService.get('MONGO_URI');
  }

  get jwtSecret() {
    return this.configService.get('JWT_SECRET');
  }

  get s3() {
    return {
      accessKey: this.configService.get('AWS_S3_ACCESS_KEY'),
      secretKey: this.configService.get('AWS_S3_SECRET_KET'),
      name: this.configService.get('AWS_S3_BUCKET_NAME')
    };
  }
}
