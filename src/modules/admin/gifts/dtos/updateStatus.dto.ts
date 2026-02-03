import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateGiftStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
