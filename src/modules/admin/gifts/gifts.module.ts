import { Module } from '@nestjs/common';
import { AdminGiftsService } from './gifts.service';

@Module({
  exports: [AdminGiftsService],
  providers: [AdminGiftsService],
})
export class AdminGiftsModule {}
