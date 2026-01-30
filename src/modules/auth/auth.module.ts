import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/database/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { Permission } from 'src/database/entities/permission.entity';
import { RolePermission } from 'src/database/entities/rolePermission.entity';
import { PasswordResetToken } from 'src/database/entities/password-reset-token.entity';

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
  exports: [AuthService],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
