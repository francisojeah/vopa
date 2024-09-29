import { Types } from 'mongoose';
import { User } from './user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';

@Schema({ timestamps: true })
export class PasswordRecover {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: User;

  @Prop({ required: true })
  code: string;
}

export const PasswordRecoverSchema =
  SchemaFactory.createForClass(PasswordRecover);
PasswordRecoverSchema.plugin(customTimestampPlugin);
