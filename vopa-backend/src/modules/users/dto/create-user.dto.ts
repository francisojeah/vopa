import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

class BaseUserDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(5, { message: 'Password should be at least 5 characters long' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Confirm password is required' })
  cpassword: string;
}

export class CreateUserDto extends BaseUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profileImage?: string;
}

class UserDto extends CreateUserDto {}


export class UpdateUserDto extends PartialType(UserDto) {}

export class LoginUserDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(5, { message: 'Password should be at least 5 characters long' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Confirm password is required' })
  // @Equals('password', { message: 'Passwords do not match' })
  cpassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Invalid request, id is required' })
  id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Invalid request, code is required' })
  code: string;
}
