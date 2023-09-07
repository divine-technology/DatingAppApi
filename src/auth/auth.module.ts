import { Global, Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { CoreModule } from '../core.module';
import { UsersModule } from '../users/user.module';

@Global()
@Module({
  imports: [forwardRef(() => UsersModule), CoreModule],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService],
  exports: [AuthService]
})
export class AuthModule {}
