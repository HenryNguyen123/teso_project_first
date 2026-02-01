import { Controller, Get, Param, Query } from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { PaginationDto } from 'src/modules/gifts/dtos/pagination.dto';
import { responseError } from 'src/shared/utils/response.util';
import { GiftsService } from './gifts.service';

@Controller('gifts')
export class GiftsController {
  constructor(private giftService: GiftsService) {}
  //step: get all gifts
  @Get()
  async getAllGifts(@Query() paginationDto: PaginationDto): Promise<IResponse> {
    try {
      const data = await this.giftService.getAllGifts(paginationDto);
      return data;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step: get gift by id
  @Get(':id')
  async getGiftById(@Param('id') id: number) {
    try {
      const data = await this.giftService.getGiftById(id);
      return data;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
}
