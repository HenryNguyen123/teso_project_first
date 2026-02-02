import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { CreateAddUserDto } from 'src/modules/users/dtos/createUser.dto';
import { UsersService } from 'src/modules/users/users.service';
import type { Express, Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from 'src/modules/users/dtos/updateUserDto.dto';
import { ChangePasswordDto } from 'src/modules/users/dtos/changePasswordDto.dto';
import { UploadFileInterceptor } from 'src/common/interceptors/uploadFile.interceptor';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //step 1: create user
  @Post('create')
  @UseInterceptors(UploadFileInterceptor('avatar', './public/img/avatar'))
  async create(
    @Body() body: CreateAddUserDto,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<IResponse> {
    const data = await this.userService.create(body, file);
    return data;
  }
  //step 5: get me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    const data = await this.userService.me(req);
    return data;
  }
  //step 6: update me
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UploadFileInterceptor('avatar', './public/img/avatar'))
  async updateMe(
    @Req() req: Request,
    @Body() body: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<IResponse> {
    const data = await this.userService.updateMe(req, body, file);
    return data;
  }
  //step : change password
  @Patch('me/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<IResponse> {
    const data = await this.userService.changePassword(req, body);
    return data;
  }
}
