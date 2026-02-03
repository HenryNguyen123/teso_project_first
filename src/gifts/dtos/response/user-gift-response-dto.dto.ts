import { Expose } from 'class-transformer';

export class UserGiftResponseDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  giftId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
