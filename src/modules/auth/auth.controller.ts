import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { responseSuccess } from 'src/shared/utils/response.util';
import type { Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { AuthLoginGuard } from './guards/auth-login.guard';
import { RoleCode } from 'src/common/enums/role-code.enums';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @UseGuards(AuthLoginGuard)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IResponse> {
    try {
      const isProd = process.env.NODE_ENV === 'production';
      const roleCode: string = RoleCode.USER;
      const data = await this.authService.login(body, roleCode);
      //step: set cookie
      res.cookie('AUTH', data.accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 30 * 60 * 1000,
        path: '/',
      });
      res.cookie('REFRESH', data.refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });
      return responseSuccess('Login successfuly', 0, data.payload);
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
