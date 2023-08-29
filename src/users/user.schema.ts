import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

export type CatDocument = Document<User>;
export type PointDocument = Document<Location>;
export type LikeDocument = Document<Like>;
export type MessageDocument = Document<Message>;

@Schema({ timestamps: true })
export class Message {
  @ApiProperty()
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Like' })
  likeId: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  from: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  to: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop()
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export interface FADILMRZITYPESCRIPT extends Omit<Message, 'likeId'> {
  likeId: Like | null;
}

@Schema()
export class Like {
  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
  users: [mongoose.Types.ObjectId, mongoose.Types.ObjectId];

  @ApiProperty()
  @Prop()
  status: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

@Schema()
export class Location {
  @ApiProperty()
  @Prop({ type: String, default: 'Point' })
  type: string;

  @ApiProperty({ type: Number, isArray: true, required: true })
  @Prop()
  coordinates: [number, number];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
@Schema()
export class User {
  @ApiProperty()
  @Prop()
  firstName: string;

  @ApiProperty()
  @Prop()
  lastName: string;

  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty()
  @Prop()
  role: string;

  @ApiProperty()
  @Prop()
  forgotPasswordToken: string;

  @ApiProperty()
  @Prop()
  forgotPasswordTimestamp: string;

  @ApiProperty()
  @Prop()
  createdAccountTimestamp: string;

  @ApiProperty()
  @Prop({ type: LocationSchema, index: '2dsphere' })
  location: Location;

  @ApiProperty()
  @Prop()
  gender: string;

  @ApiProperty()
  @Prop()
  preference: string;

  @ApiProperty()
  @Prop()
  age: number;

  @ApiProperty()
  @Prop()
  bio: string;

  @ApiProperty()
  @Prop()
  hobbies: string[];
}

export class UserWithId extends User {
  @ApiProperty()
  @Prop()
  _id: mongoose.Types.ObjectId;
}

export class LikeWithId extends Like {
  @ApiProperty()
  @Prop()
  _id: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
