import { Module } from '@nestjs/common';
import { GiftsService } from './services/user/gifts-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemGift } from 'src/gifts/entities/system-gift.entity';
import { UserGift } from 'src/gifts/entities/user-gift.entity';
import { User } from 'src/users/entities/user.entity';
import { AdminGiftsService } from './services/admin/gifts-admin.service';
import { GiftsController } from './controllers/user/gifts-user.controller';
import { AdminGiftsController } from './controllers/admin/gifts-admin.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SystemGift, UserGift, User]), AuthModule],
  controllers: [GiftsController, AdminGiftsController],
  exports: [GiftsService, AdminGiftsService],
  providers: [GiftsService, AdminGiftsService],
})
export class GiftsModule {}
