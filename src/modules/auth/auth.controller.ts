import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { responseError } from 'src/shared/utils/response.util';
import type { Response, Request } from 'express';
// import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<IResponse> {
    try {
      const data = await this.authService.login(body, res, req);
      return data;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
}
