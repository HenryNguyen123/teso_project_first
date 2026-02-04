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
import { CreateAddUserDto } from 'src/users/dtos/reques/create-user.dto';
import { UsersService } from 'src/users/services/users.service';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from 'src/users/dtos/reques/update-user-dto.dto';
import { ChangePasswordDto } from 'src/users/dtos/reques/change-password-dto.dto';
import { UploadFileInterceptor } from 'src/common/interceptors/upload-file.interceptor';
import { UserResponseDto } from 'src/users/dtos/response/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //step 1: create user
  @Post()
  @UseInterceptors(UploadFileInterceptor('avatar', './public/img/avatar'))
  async create(
    @Body() body: CreateAddUserDto,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<UserResponseDto> {
    const data = await this.userService.create(body, file);
    return data;
  }
  //step 5: get me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request): Promise<UserResponseDto> {
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
  ): Promise<UserResponseDto> {
    const data = await this.userService.updateMe(req, body, file);
    return data;
  }
  //step : change password
  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    console.log(body);
    const data = await this.userService.changePassword(req, body);
    return data;
  }
}
