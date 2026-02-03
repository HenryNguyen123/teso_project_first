import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from 'src/auth/dtos/request/login.dto';
import { RoleCode } from 'src/auth/enums/role-code.enums';
import { AdminAuthService } from 'src/auth/services/admin/auth-admin.service';
import { LoginResponseDto } from 'src/auth/dtos/response/login-response.dto';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}
  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    const roleCode: string = RoleCode.ADMIN;
    return await this.adminAuthService.login(body, roleCode);
  }
}
