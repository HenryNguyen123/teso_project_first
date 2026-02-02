import { IsBoolean } from 'class-validator';

export class UpdateGiftStatusDto {
  @IsBoolean()
  isActive: boolean;
}
