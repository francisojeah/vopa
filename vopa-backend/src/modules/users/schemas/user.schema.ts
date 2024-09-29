import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';
import { UserProps } from '../interfaces/user.interfaces';

export type UserDocument = HydratedDocument<UserProps>;

enum Role {
  User = 'user',
  Admin = 'admin',
  Client = 'client',
}

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  profileImage: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  updated_at: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: [String], enum: Object.values(Role), default: [Role.User] })
  roles: Role[];

  @Prop({ default: false })
  isBanned: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(customTimestampPlugin);
