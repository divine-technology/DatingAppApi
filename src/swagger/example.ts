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

export const UPDATE_USER_EXAMPLE = {
  name: 'John Doe',
  email: 'john@gmail.com',
  password: 'test123',
  role: 'Admin',
  forgotPasswordToken: 'token',
  forgotPasswordTimestamp: new Date(),
  createdAccountTimestamp: new Date(),
  location: {
    type: 'Point',
    coordinates: [44.20169, 17.90397]
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
