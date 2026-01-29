import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { CreateAddUserDto } from 'src/modules/users/dtos/createUser.dto';
import { UsersService } from 'src/modules/users/users.service';
import { responseError } from 'src/shared/utils/response.util';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //step 1: create user
  @Post('create')
  async create(@Body() body: CreateAddUserDto): Promise<IResponse> {
    try {
      console.log('body: ', body);
      const data = await this.userService.create(body);
      return data;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
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
