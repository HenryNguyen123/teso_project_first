import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/services/user/auth-user.service';
import { LoginDto } from 'src/auth/dtos/request/login.dto';
import { RoleCode } from 'src/auth/enums/role-code.enums';
import { LoginResponseDto } from 'src/auth/dtos/response/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    const roleCode: string = RoleCode.USER;
    return await this.authService.login(body, roleCode);
  }
}
