import { Expose, Type } from 'class-transformer';
import { GiftItemResponseDto } from 'src/gifts/dtos/response/get-all-gifts-response.dto';

export class GiftPaginationResponseDto {
  @Expose()
  @Type(() => GiftItemResponseDto)
  data: GiftItemResponseDto[];

  @Expose()
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
