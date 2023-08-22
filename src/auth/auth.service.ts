import {
  ConflictException,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { UsersService, numberOfSalts } from '../users/user.service';
import {
  AuthResponseDto,
  AuthUser,
  ForgotPasswordResponseDto,
  LoginUserDto
} from './auth.types';
import * as bcrypt from 'bcryptjs';
import { ForgotPasswordDto } from './auth.types';
import { ChangeForgotPasswordDto } from './auth.types';
import { ChangePasswordDto } from './auth.types';
import { CreateUserDto } from '../users/user.types';
import { User } from '../users/user.schema';
import { Roles } from '../users/user.enum';
import { ContextService } from '../context/context.service';

export const NUMBER_OF_SALTS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private readonly contextService: ContextService
  ) {}

  async test() {
    return await this.authRepository.test();
  }

  async loginUser(user: LoginUserDto): Promise<AuthResponseDto> {
    const { email, password } = user;
    const conditionArray = [{ email }];
    const fetchedUser = await this.userService.findUserBy(conditionArray);
    console.log(fetchedUser);
    if (!fetchedUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const doesPasswordMatch = await bcrypt.compare(
      password,
      fetchedUser.password
    );
    if (!doesPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: fetchedUser._id });
    const dataToReturn: AuthResponseDto = {
      user: {
        _id: fetchedUser._id,
        name: fetchedUser.name,
        email: fetchedUser.email,
        role: fetchedUser.role,
        createdAccountTimeStamp: fetchedUser.createdAccountTimestamp,
        location: fetchedUser.location,
        gender: fetchedUser.gender,
        preference: fetchedUser.preference,
        age: fetchedUser.age,
        bio: fetchedUser.bio,
        hobbies: fetchedUser.hobbies
      },
      token: token
    };
    return dataToReturn;
  }

  async getMe(): Promise<AuthUser> {
    const dataToReturn = this.contextService.userContext.user;
    return dataToReturn;
  }

  async createUser(user: CreateUserDto): Promise<AuthResponseDto> {
    const { email, password } = user;
    const lowercaseEmail = email.toLowerCase();
    const conditionArray = [];
    conditionArray.push({ email });
    const existingUser = await this.userService.findUserBy(conditionArray);
    if (existingUser != null) {
      throw new ConflictException('Email already exists!');
    } else {
      const hashedPassword = await bcrypt.hash(password, numberOfSalts);
      const newUser: User = {
        ...user,
        email: lowercaseEmail,
        password: hashedPassword,
        role: Roles.ADMIN,
        forgotPasswordToken: null,
        forgotPasswordTimestamp: null,
        createdAccountTimestamp: new Date().toISOString(),
        location: {
          type: 'Point',
          coordinates: [43.85643, 18.413029]
        },
        gender: null,
        preference: null,
        age: null,
        bio: null,
        hobbies: null
      };
      const finalUser = await this.authRepository.createUser(newUser);
      const token = this.jwtService.sign({ id: finalUser._id });

      const dataToReturn: AuthResponseDto = {
        user: {
          _id: finalUser._id,
          name: finalUser.name,
          email: finalUser.email,
          role: finalUser.role,
          createdAccountTimeStamp: finalUser.createdAccountTimestamp,
          location: finalUser.location,
          gender: finalUser.gender,
          preference: finalUser.preference,
          age: finalUser.age,
          bio: finalUser.bio,
          hobbies: finalUser.hobbies
        },
        token: token
      };

      return dataToReturn;
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<ForgotPasswordResponseDto> {
    const { email } = forgotPasswordDto;
    const conditionArray = [{ email }];
    const fetchedUser = await this.userService.findUserBy(conditionArray);
    if (!fetchedUser) {
      throw new UnauthorizedException(
        'Email can only be sent to the original account email.'
      );
    }
    const token = generateRandomString();
    const timestamp = new Date().toISOString();
    const newUser = await this.authRepository.updateRecoveryTokenByEmail({
      id: fetchedUser._id.toString(),
      token,
      timestamp
    });
    const user = await this.userService.findUserBy(conditionArray);
    return {
      forgotPasswordToken: user.forgotPasswordToken
    };
  }

  async updateRecoveryTokenByEmail(
    email: string,
    token: string,
    timestamp: string
  ): Promise<string> {
    const conditionArray = [{ email }];
    const user = await this.userService.findUserBy(conditionArray);
    await this.authRepository.updateRecoveryTokenByEmail({
      id: user._id.toString(),
      token,
      timestamp
    });
    return 'Updated!';
  }

  async changeForgotPassword(
    changeForgotPasswordDto: ChangeForgotPasswordDto
  ): Promise<string> {
    const { email, forgotPasswordToken, newPassword } = changeForgotPasswordDto;
    const conditionArray = [{ email }];
    const fetchedUser = await this.userService.findUserBy(conditionArray);
    if (!fetchedUser) {
      throw new UnauthorizedException('Unable to find user.');
    }

    if (forgotPasswordToken != fetchedUser.forgotPasswordToken) {
      throw new UnauthorizedException('Incorrect recovery token.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, NUMBER_OF_SALTS);
    const doesPasswordMatch = await bcrypt.compare(
      newPassword,
      fetchedUser.password
    );
    if (doesPasswordMatch) {
      throw new UnauthorizedException(
        'Password cannot be the same as the old one!'
      );
    }

    await this.authRepository.updatePassword({
      id: fetchedUser._id.toString(),
      password: hashedPassword
    });
    return 'Password updated!';
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<string> {
    const { email, oldPassword, newPassword, confirmNewPassword } =
      changePasswordDto;

    const conditionArray = [{ email }];
    const fetchedUser = await this.userService.findUserBy(conditionArray);

    const doesPasswordMatch = await bcrypt.compare(
      oldPassword,
      fetchedUser.password
    );

    if (!fetchedUser) {
      throw new UnauthorizedException('Unable to find user.');
    }
    if (!doesPasswordMatch) {
      throw new UnauthorizedException('Old password does not match.');
    }
    if (newPassword !== confirmNewPassword) {
      throw new UnauthorizedException('New passwords do not match.');
    }

    const isNewSameAsOld = await bcrypt.compare(
      newPassword,
      fetchedUser.password
    );
    if (isNewSameAsOld) {
      throw new UnauthorizedException(
        'New password cannot be the same as older passwords'
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, NUMBER_OF_SALTS);
    await this.authRepository.updatePassword({
      id: fetchedUser._id.toString(),
      password: hashedPassword
    });
    return 'Password updated!';
  }
}

function generateRandomString(): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
