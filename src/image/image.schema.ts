import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema({ timestamps: true })
export class Image {
  @Prop()
  awsKey: string;
  @Prop()
  name: string;
  @Prop()
  extension: string | null;
  @Prop()
  mimetype: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
