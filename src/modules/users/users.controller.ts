import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { IResponse } from 'src/common/interfaces/response.interface';
import { CreateAddUserDto } from 'src/modules/users/dtos/createUser.dto';
import { UsersService } from 'src/modules/users/users.service';
import { responseError } from 'src/shared/utils/response.util';
import type { Express } from 'express';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //step 1: create user
  @Post('create')
  @UseInterceptors(
    FileInterceptor('avatar', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      storage: diskStorage({
        destination: './public/img/avatar',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
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
}
