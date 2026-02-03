import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RoleCode } from 'src/auth/enums/role-code.enums';
import { IJwtPayload } from 'src/auth/interfaces/jwt.interface';

@Injectable()
export class RoleAdminGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as IJwtPayload;
    if (!user || user.roleCode !== RoleCode.ADMIN)
      throw new UnauthorizedException('nember dont have permission');
    return true;
  }
}
