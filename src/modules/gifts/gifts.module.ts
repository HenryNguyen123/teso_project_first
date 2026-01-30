import { Module } from '@nestjs/common';
import { GiftsService } from './gifts.service';

@Module({
  providers: [GiftsService],
})
export class GiftsModule {}
