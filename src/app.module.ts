import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { RoleController } from './modules/role/role.controller';
import { RoleModule } from './modules/role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/database/entities/role.entity';
import 'dotenv/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthController } from 'src/modules/auth/auth.controller';
import { Permission } from 'src/database/entities/permission.entity';
import { RolePermission } from 'src/database/entities/rolePermission.entity';
import { PasswordResetToken } from 'src/database/entities/password-reset-token.entity';
import { GiftsController } from 'src/modules/gifts/gifts.controller';
import { AdminGiftsController } from 'src/modules/admin/gifts/gifts.controller';
import { GiftsModule } from 'src/modules/gifts/gifts.module';
import { AdminGiftsModule } from 'src/modules/admin/gifts/gifts.module';
import { UserGift } from 'src/database/entities/user-gift.entity';
import { SystemGift } from 'src/database/entities/system-gift.entity';
import { AdminAuthController } from 'src/modules/admin/auth/auth.controller';
import { AdminAuthModule } from 'src/modules/admin/auth/auth.module';
import { AuthService } from 'src/modules/auth/auth.service';

@Module({
  imports: [
    UsersModule,
    RoleModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [
        User,
        Role,
        Permission,
        RolePermission,
        PasswordResetToken,
        UserGift,
        SystemGift,
      ],
      synchronize: true,
      logging: false,
    }),
    GiftsModule,
    AdminGiftsModule,
    TypeOrmModule.forFeature([User]),
    AdminAuthModule,
  ],
  controllers: [
    AppController,
    UsersController,
    RoleController,
    AuthController,
    GiftsController,
    AdminGiftsController,
    AdminAuthController,
  ],
  providers: [AppService, AuthService],
})
export class AppModule {}
