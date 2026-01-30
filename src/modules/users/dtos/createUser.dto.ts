import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAddUserDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password should not be empty' })
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'password should not be empty' })
  fullName: string;

  // @IsString()
  // avatar?: string;

  @IsOptional()
  @Type(() => Date)
  dob?: Date;

  @IsString()
  gender?: string;
}
