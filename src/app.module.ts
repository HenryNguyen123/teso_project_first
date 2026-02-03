import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/controllers/users.controller';
import { UsersModule } from './users/users.module';
import { RoleController } from './role/role.controller';
import { RoleModule } from './role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/entities/role.entity';
import 'dotenv/config';
import { AuthModule } from 'src/auth/auth.module';
import { AuthController } from 'src/auth/controllers/user/auth-user.controller';
import { Permission } from 'src/auth/entities/permission.entity';
import { RolePermission } from 'src/auth/entities/role-permission.entity';
import { PasswordResetToken } from 'src/auth/entities/password-reset-token.entity';
import { GiftsController } from 'src/gifts/controllers/user/gifts-user.controller';
import { AdminGiftsController } from 'src/gifts/controllers/admin/gifts-admin.controller';
import { GiftsModule } from 'src/gifts/gifts.module';
import { UserGift } from 'src/gifts/entities/user-gift.entity';
import { SystemGift } from 'src/gifts/entities/system-gift.entity';
import { AdminAuthController } from 'src/auth/controllers/admin/auth.controller';
import { AuthService } from 'src/auth/services/user/auth-user.service';
import { JwtService } from '@nestjs/jwt';

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
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      RolePermission,
      PasswordResetToken,
      UserGift,
      SystemGift,
    ]),
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
  providers: [AppService, AuthService, JwtService],
})
export class AppModule {}
