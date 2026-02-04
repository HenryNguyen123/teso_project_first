import { Module } from '@nestjs/common';
import { AuthService } from './services/user/auth-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { Permission } from 'src/auth/entities/permission.entity';
import { RolePermission } from 'src/auth/entities/role-permission.entity';
import { PasswordResetToken } from 'src/auth/entities/password-reset-token.entity';
import { AuthLoginGuard } from 'src/auth/guards/auth-login.guard';
import { AdminAuthService } from 'src/auth/services/admin/auth-admin.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      RolePermission,
      PasswordResetToken,
    ]),
  ],
  exports: [AuthService, AuthLoginGuard, AdminAuthService, ConfigService],
  providers: [AuthService, JwtService, AuthLoginGuard, AdminAuthService, ConfigService],
})
export class AuthModule {}
