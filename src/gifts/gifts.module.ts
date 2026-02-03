import { Module } from '@nestjs/common';
import { GiftsService } from './services/user/gifts-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemGift } from 'src/gifts/entities/system-gift.entity';
import { UserGift } from 'src/gifts/entities/user-gift.entity';
import { User } from 'src/users/entities/user.entity';
import { AdminGiftsService } from './services/admin/gifts-admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemGift, UserGift, User])],
  exports: [TypeOrmModule, GiftsService, AdminGiftsService],
  providers: [GiftsService, AdminGiftsService],
})
export class GiftsModule {}
