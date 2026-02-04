import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdateGiftStatusDto {
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'isActive must be a boolean check' })
  isActive: boolean;
}
