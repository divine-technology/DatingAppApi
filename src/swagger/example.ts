import { ExamplesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const USER_RADIUS_EXAMPLE = {
  location: {
    type: 'Point',
    coordinates: [44.20169, 17.90397]
  },
  radius: 600
};

export const CREATE_USER_EXAMPLE = {
  example1: {
    value: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@gmail.com',
      password: 'test123'
    }
  }
};

export const UPDATE_USER_EXAMPLE = {
  example1: {
    value: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@gmail.com',
      password: 'test123',
      role: 'Admin',
      forgotPasswordToken: 'token',
      forgotPasswordTimestamp: new Date().toString(),
      createdAccountTimestamp: new Date().toString(),
      location: {
        type: 'Point',
        coordinates: [44.20169, 17.90397]
      }
    }
  }
};

export const REACT_WITH_USER_EXAMPLE = {
  example1: {
    value: {
      likedUserId: '64629b6bfc23c7a8072ee1b2',
      status: 'liked',
      likedPhotoUrl: 'test url'
    }
  }
};

export const SEND_MESSAGE_EXAMPLE = {
  example1: {
    value: {
      from: 'a',
      message: 'hello'
    }
  }
};

export const LOGIN_USER_EXAMPLE = {
  example1: {
    value: {
      email: 'test@mail.com',
      password: 'test123'
    }
  }
};

export const FORGOT_PASSWORD_EXAMPLE = {
  example1: {
    value: {
      email: 'test@mail.com'
    }
  }
};

export const CHANGE_FORGOT_PASSWORD_EXAMPLE = {
  example1: {
    value: {
      email: 'test@mail.com',
      forgotPasswordToken: 'r12bnrj1nsk2n1',
      newPassword: 'test123'
    }
  }
};

export const CHANGE_PASSWORD_EXAMPLE = {
  example1: {
    value: {
      email: 'test@mail.com',
      oldPassword: 'test123',
      newPassword: 'test1234',
      confirmNewPassword: 'test1234'
    }
  }
};
