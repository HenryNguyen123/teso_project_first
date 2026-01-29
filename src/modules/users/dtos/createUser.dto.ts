import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAddUserDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'Email should not be empty' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'password should not be empty' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(6)
  password: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'password should not be empty' })
  fullName: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  avatart?: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Type(() => Date)
  dob?: Date;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  gender?: string;
}
