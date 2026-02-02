import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RoleCode } from 'src/common/enums/role-code.enums';
import { IJwtPayload } from 'src/common/interfaces/jwt.interface';

@Injectable()
export class RoleAdminGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.AUTH as string | undefined;
    if (!token) throw new UnauthorizedException('Token not found');

    const payload = await this.jwtService.verifyAsync<IJwtPayload>(token, {
      secret: process.env.JWT_SECRET_KEY,
    });
    if (!payload) throw new UnauthorizedException('Token jwt not found');
    const roleCode = payload.roleCode as RoleCode;
    if (!payload.roleCode || roleCode !== RoleCode.ADMIN)
      throw new UnauthorizedException('nember dont have permission');
    req['user'] = payload;
    return true;
  }
}
