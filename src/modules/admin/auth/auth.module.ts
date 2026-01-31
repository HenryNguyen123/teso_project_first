import { Module } from '@nestjs/common';
import { adminAuthService } from 'src/modules/admin/auth/auth.service';

@Module({
  exports: [adminAuthService],
  providers: [adminAuthService],
})
export class AdminAuthModule {}
