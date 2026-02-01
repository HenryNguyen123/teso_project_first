import { Module } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemGift } from 'src/database/entities/system-gift.entity';
import { UserGift } from 'src/database/entities/user-gift.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemGift, UserGift])],
  exports: [TypeOrmModule, GiftsService],
  providers: [GiftsService],
})
export class GiftsModule {}
