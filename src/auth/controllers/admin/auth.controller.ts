import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginDto } from 'src/auth/dtos/request/login.dto';
import { RoleCode } from 'src/auth/enums/role-code.enums';
import { AdminAuthService } from 'src/auth/services/admin/auth-admin.service';
import { LoginResponseDto } from 'src/auth/dtos/response/login-response.dto';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    const roleCode: string = RoleCode.ADMIN;
    return await this.adminAuthService.login(body, roleCode);
  }
}
