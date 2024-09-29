import { Types } from 'mongoose';
import { User } from './user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';

@Schema({ timestamps: true })
export class UserEmailVerification {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: User;

  @Prop({ required: true })
  emailToken: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const UserEmailVerificationSchema = SchemaFactory.createForClass(
  UserEmailVerification,
);

UserEmailVerificationSchema.plugin(customTimestampPlugin);
