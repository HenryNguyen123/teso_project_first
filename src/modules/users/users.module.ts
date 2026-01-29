import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
