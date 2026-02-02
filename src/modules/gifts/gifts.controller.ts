import { Controller, Get, Param, Query } from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { PaginationDto } from 'src/modules/gifts/dtos/pagination.dto';
import { GiftsService } from './gifts.service';

@Controller('gifts')
export class GiftsController {
  constructor(private giftService: GiftsService) {}
  //step: get all gifts
  @Get()
  async getAllGifts(@Query() paginationDto: PaginationDto): Promise<IResponse> {
    const data = await this.giftService.getAllGifts(paginationDto);
    return data;
  }
  //step: get gift by id
  @Get(':id')
  async getGiftById(@Param('id') id: number) {
    const data = await this.giftService.getGiftById(id);
    return data;
  }
}
