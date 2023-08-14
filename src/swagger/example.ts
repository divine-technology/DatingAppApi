import { ExamplesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { UpdateUserDto } from '../users/dto/update.user.dto';

export const USER_RADIUS_EXAMPLE = {
  location: {
    type: 'Point',
    coordinates: [44.20169, 17.90397]
  },
  radius: 600
};

export const CREATE_USER_EXAMPLE = {
  name: 'John Doe',
  email: 'john@gmail.com',
  password: 'test123'
};

export const UPDATE_USER_EXAMPLE: ExamplesObject = {
  name: { value: 'John Doe' },
  email: { value: 'john@gmail.com' },
  password: { value: 'test123' },
  role: { value: 'Admin' },
  forgotPasswordToken: { value: 'token' },
  forgotPasswordTimestamp: { value: new Date().toString() },
  createdAccountTimestamp: { value: new Date().toString() },
  location: {
    value: {
      type: 'Point',
      coordinates: [44.20169, 17.90397]
    }
  }
};

export const REACT_WITH_USER_EXAMPLE = {
  likedUserId: '64629b6bfc23c7a8072ee1b2',
  status: 'liked',
  likedPhotoUrl: 'test url'
};

export const SEND_MESSAGE_EXAMPLE = {
  from: 'a',
  to: 'b',
  message: 'hello'
};

export const LOGIN_USER_EXAMPLE = {
  email: 'test@mail.com',
  password: 'test123'
};

export const CHANGE_FORGOT_PASSWORD_EXAMPLE = {
  email: 'test@mail.com',
  forgotPasswordToken: 'r12bnrj1nsk2n1',
  newPassword: 'test123'
};

export const CHANGE_PASSWORD_EXAMPLE = {
  email: 'test@mail.com',
  oldPassword: 'test123',
  newPassword: 'test1234',
  confirmNewPassword: 'test1234'
};
