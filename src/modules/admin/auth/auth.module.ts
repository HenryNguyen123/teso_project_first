import { Module } from '@nestjs/common';
import { AdminAuthService } from 'src/modules/admin/auth/auth.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  exports: [AdminAuthService],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
