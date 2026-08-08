import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { AccessTokenGuard } from './access-token.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthorizationService } from './authorization.service';
import { CompanyAccessGuard } from './guards/company-access.guard';
import { ProjectAccessGuard } from './guards/project-access.guard';
import { RefreshOriginGuard } from './guards/refresh-origin.guard';

@Module({
  imports: [
    JwtModule.register({}),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenGuard,
    AuthorizationService,
    CompanyAccessGuard,
    ProjectAccessGuard,
    RefreshOriginGuard,
  ],
  exports: [
    AuthService,
    AuthorizationService,
    CompanyAccessGuard,
    ProjectAccessGuard,
  ],
})
export class AuthModule {}
