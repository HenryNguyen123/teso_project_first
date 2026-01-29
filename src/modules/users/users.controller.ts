import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //step 1: create user
  @Post('create')
  async create() {}
  //step 2: read user
  @Get('read')
  async read() {}
  //step 3: update user
  @Put('update')
  async update() {}
  //step 4: delete user
  @Delete('destroy')
  async destroy() {}
}
