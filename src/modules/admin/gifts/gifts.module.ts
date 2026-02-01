import { Module } from '@nestjs/common';
import { AdminGiftsService } from './gifts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemGift } from 'src/database/entities/system-gift.entity';
import { UserGift } from 'src/database/entities/user-gift.entity';
import { User } from 'src/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemGift, UserGift, User])],
  exports: [AdminGiftsService],
  providers: [AdminGiftsService],
})
export class AdminGiftsModule {}
