import { Controller, Post, Body, Res } from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { responseSuccess } from 'src/shared/utils/response.util';
import type { Response } from 'express';
import { RoleCode } from 'src/common/enums/role-code.enums';
import { AdminAuthService } from 'src/modules/admin/auth/auth.service';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IResponse> {
    const isProd = process.env.NODE_ENV === 'production';
    const roleCode: string = RoleCode.ADMIN;
    const data = await this.adminAuthService.login(body, roleCode);
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
  }
}
