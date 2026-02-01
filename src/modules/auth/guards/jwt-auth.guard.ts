import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { IPayloadLogin } from 'src/common/interfaces/login.interface';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.AUTH as string | undefined;
    if (!token) throw new UnauthorizedException('Token not found');

    const payload = await this.jwtService.verifyAsync<IPayloadLogin>(token, {
      secret: process.env.JWT_SECRET_KEY,
    });
    if (!payload) throw new UnauthorizedException('Token not found');

    req['user'] = payload;
    return true;
  }
}
