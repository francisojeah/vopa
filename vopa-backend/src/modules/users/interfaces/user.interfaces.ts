import { Types } from 'mongoose';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export interface UserProps {
  id?: string;
  _id?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  cpassword?: string;
  email?: string;
  profileImage?: string;
  isVerified?: boolean;
  isRegistered?: boolean;
  roles?: Role[];
  code?: string;
  createdAt?: Date;
  updatedAt?: Date;
  toObject?: () => any;
}

export interface AuthProps {
  email?: string;
  password?: string;
}
