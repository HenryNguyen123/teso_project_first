import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { emailRegex } from 'src/common/utils/regex.util';

interface LoginBody {
  email?: string;
  password?: string;
}

@Injectable()
export class AuthLoginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const body = request.body as LoginBody;

    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    return true;
  }
}
