import { Transform, Type } from 'class-transformer';
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
  @Transform(({ value }) => value.trim())
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password should not be empty' })
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'fullName should not be empty' })
  @Transform(({ value }) => value.trim())
  @MinLength(2)
  fullName: string;

  @IsOptional()
  @Type(() => Date)
  dob?: Date;

  @IsOptional()
  @IsString()
  gender?: string;
}
