import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PaginationDto } from 'src/gifts/dtos/response/pagination.dto';
import { GiftsService } from '../../services/user/gifts-user.service';
import { GiftPaginationResponseDto } from 'src/gifts/dtos/response/gift-pagination-response-dto.dto';
import { GiftItemResponseDto } from 'src/gifts/dtos/response/get-all-gifts-response.dto';

@Controller('gifts')
export class GiftsController {
  constructor(private giftService: GiftsService) {}
  //step: get all gifts
  @Get()
  async getAllGifts(
    @Query() paginationDto: PaginationDto,
  ): Promise<GiftPaginationResponseDto> {
    const data = await this.giftService.getAllGifts(paginationDto);
    return data;
  }
  //step: get gift by id
  @Get(':id')
  async getGiftById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GiftItemResponseDto> {
    const data = await this.giftService.getGiftById(id);
    return data;
  }
}
