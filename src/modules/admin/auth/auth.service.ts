import { Injectable } from '@nestjs/common';
import { IResponseLogin } from 'src/common/interfaces/login.interface';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AdminAuthService {
  constructor(private authService: AuthService) {}
  async login(body: LoginDto, roleCode: string): Promise<IResponseLogin> {
    return this.authService.login(body, roleCode);
  }
}
