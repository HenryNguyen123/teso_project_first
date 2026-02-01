import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { IResponse } from 'src/common/interfaces/response.interface';
import { CreateAddUserDto } from 'src/modules/users/dtos/createUser.dto';
import { UsersService } from 'src/modules/users/users.service';
import { responseError } from 'src/shared/utils/response.util';
import type { Express, Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from 'src/modules/users/dtos/updateUserDto.dto';
import { AvatarUploadInterceptor } from 'src/modules/users/interceptors/avatarUpload.interceptor';
import { ChangePasswordDto } from 'src/modules/users/dtos/changePasswordDto.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //step 1: create user
  @Post('create')
  @UseInterceptors(AvatarUploadInterceptor)
  async create(
    @Body() body: CreateAddUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse> {
    try {
      const data = await this.userService.create(body, file);
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
  //step 5: get me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    try {
      const data = await this.userService.me(req);
      return data;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step 6: update me
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AvatarUploadInterceptor)
  async updateMe(
    @Req() req: Request,
    @Body() body: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse> {
    try {
      const data = await this.userService.updateMe(req, body, file);
      return data;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step : change password
  @Patch('me/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<IResponse> {
    try {
      const data = await this.userService.changePassword(req, body);
      return data;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
}
