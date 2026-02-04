import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RoleCode } from 'src/auth/enums/role-code.enums';
import { IJwtPayload } from 'src/auth/interfaces/jwt.interface';

@Injectable()
export class RoleAdminGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as IJwtPayload;
    const role = user.roleCode as RoleCode;
    if (!role) return false;
    if (!user || role !== RoleCode.ADMIN)
      throw new UnauthorizedException('nember dont have permission');
    return await Promise.resolve(role === RoleCode.ADMIN);
  }
}
