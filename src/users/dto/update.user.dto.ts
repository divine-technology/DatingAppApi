export class UpdateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
  forgotPasswordToken: string;
  forgotPasswordTimestamp: string;
  createdAccountTimestamp: string;
  location: {
    type: string;
    coordinates: number[];
  };
}
