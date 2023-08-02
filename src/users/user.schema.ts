import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CatDocument = Document<User>;
export type PointDocument = Document<Location>;
export type LikeDocument = Document<Like>;
export type MessageDocument = Document<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Like' })
  likeId: mongoose.Types.ObjectId;

  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop()
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export interface FADILMRZITYPESCRIPT extends Omit<Message, 'likeId'> {
  likeId: Like | null;
}

@Schema()
export class Like {
  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
  users: [mongoose.Types.ObjectId, mongoose.Types.ObjectId];

  @Prop()
  status: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

@Schema()
export class Location {
  @Prop({ type: String, default: 'Point' })
  type: string;

  @Prop({ type: [Number], required: true })
  coordinates: number[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: string;

  @Prop()
  forgotPasswordToken: string;

  @Prop()
  forgotPasswordTimestamp: string;

  @Prop()
  createdAccountTimestamp: string;

  @Prop({ type: LocationSchema, index: '2dsphere' })
  location: Location;
}

export class UserWithId extends User {
  @Prop()
  _id: mongoose.Types.ObjectId;
}

export class LikeWithId extends Like {
  @Prop()
  _id: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
