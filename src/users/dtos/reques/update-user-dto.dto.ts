import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
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
