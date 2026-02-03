import { Expose, Type } from 'class-transformer';
import { UserGiftResponseDto } from 'src/gifts/dtos/response/user-gift-response-dto.dto';

export class GiftItemResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  image: string;

  @Expose()
  quantity: number;

  @Expose()
  isActive: boolean;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  @Expose()
  @Type(() => UserGiftResponseDto)
  userGifts: UserGiftResponseDto[];
}
