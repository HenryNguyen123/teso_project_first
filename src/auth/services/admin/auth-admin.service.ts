import { Injectable } from '@nestjs/common';
import { IResponseLogin } from 'src/auth/interfaces/login.interface';
import { LoginDto } from 'src/auth/dtos/request/login.dto';
import { AuthService } from 'src/auth/services/user/auth-user.service';

@Injectable()
export class AdminAuthService {
  constructor(private authService: AuthService) {}
  async login(body: LoginDto, roleCode: string): Promise<IResponseLogin> {
    return this.authService.login(body, roleCode);
  }
}
