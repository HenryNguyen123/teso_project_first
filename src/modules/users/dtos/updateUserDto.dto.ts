import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {

  @IsString()
  @IsNotEmpty({ message: 'fullName should not be empty' })
  fullName: string;

  @IsOptional()
  @Type(() => Date)
  dob?: Date;

  @IsString()
  gender?: string;
}
