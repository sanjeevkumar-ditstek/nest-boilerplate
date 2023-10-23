import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { Timestamp } from 'src/shared/schema/Meta.schema';
export type UserDocument = User & Document;

@Schema()
export class User extends Timestamp {
  @Prop({ default: nanoid() })
  _id: string;

  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
