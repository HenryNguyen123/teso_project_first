import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @Transform(({ value }) => value.trim())
  @MinLength(6)
  password: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  @Transform(({ value }) => value.trim())
  email: string;
}
