import { Controller, Get, Post } from '@nestjs/common';
import { AdminGiftsService } from 'src/modules/admin/gifts/gifts.service';

@Controller('admin/gifts')
export class AdminGiftsController {
  constructor(private adminGriftService: AdminGiftsService) {}
  //step: create gift
  @Post('create')
  async create() {}
  //step: read gift all
  @Get('read')
  // eslint-disable-next-line @typescript-eslint/require-await
  async read() {
    return 'read gift';
  }
  //step: update gift
  @Post('update')
  async update() {}
  //step: delete gift
  @Post('destroy')
  async destroy() {}
}
