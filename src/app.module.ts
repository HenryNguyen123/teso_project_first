import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/entities/role.entity';
import 'dotenv/config';
import { AuthModule } from 'src/auth/auth.module';
import { Permission } from 'src/auth/entities/permission.entity';
import { RolePermission } from 'src/auth/entities/role-permission.entity';
import { PasswordResetToken } from 'src/auth/entities/password-reset-token.entity';
import { GiftsModule } from 'src/gifts/gifts.module';
import { UserGift } from 'src/gifts/entities/user-gift.entity';
import { SystemGift } from 'src/gifts/entities/system-gift.entity';

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
  ],
})
export class AppModule {}
