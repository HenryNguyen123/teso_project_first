import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(6)
  password: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  email: string;
}
