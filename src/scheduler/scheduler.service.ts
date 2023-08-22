import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/user.service';
import { AuthService } from '../auth/auth.service';
import { UserPaginateDto } from '../users/user.types';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async test() {
    const timeFiveMinutesAgo = new Date();
    const test: UserPaginateDto = {
      limit: 0,
      page: 1,
      sort: -1,
      sortBy: 'forgotPasswordTimestamp',
      name: null,
      email: null,
      role: null,
      forgotPasswordToken: null,
      forgotPasswordTimestamp: new Date(
        timeFiveMinutesAgo.setMinutes(timeFiveMinutesAgo.getMinutes() - 5)
      ).toISOString(),
      createdAccountTimestamp: null,
      gender: null,
      preference: null,
      age: null,
      hobbies: null
    };
    console.log('Scheduler radi');
    const users = await this.userService.getAllUsers(test);
    const promises = [];
    users.data.forEach((user) => {
      promises.push(
        this.authService.updateRecoveryTokenByEmail(user.email, null, null)
      );
    });
    await Promise.all(promises);
  }
}
