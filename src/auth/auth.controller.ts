import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import type { AppConfig } from '../config/app.config';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './auth.types';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { AllowDuringPasswordChange } from './decorators/allow-during-password-change.decorator';
import { RefreshOriginGuard } from './guards/refresh-origin.guard';

const REFRESH_COOKIE = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(dto, {
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    });

    this.setRefreshCookie(response, result.refreshToken);
    return { accessToken: result.accessToken, usuario: result.usuario };
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshOriginGuard, ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const result = await this.authService.refresh(
        this.readRefreshCookie(request),
      );

      this.setRefreshCookie(response, result.refreshToken);
      return { accessToken: result.accessToken, usuario: result.usuario };
    } catch (error) {
      response.clearCookie(REFRESH_COOKIE, this.cookieOptions());
      throw error;
    }
  }

  @Post('logout')
  @AllowDuringPasswordChange()
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(request.user);
    response.clearCookie(REFRESH_COOKIE, this.cookieOptions());
  }

  @Get('me')
  @AllowDuringPasswordChange()
  me(@Req() request: AuthenticatedRequest) {
    return request.user;
  }

  @Post('change-password')
  @AllowDuringPasswordChange()
  async changePassword(
    @Req() request: AuthenticatedRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changeRequiredPassword(request.user, dto.novaSenha);
  }

  private readRefreshCookie(request: Request) {
    const cookies = request.cookies as Record<string, unknown> | undefined;
    const token = cookies?.[REFRESH_COOKIE];
    return typeof token === 'string' ? token : undefined;
  }

  private setRefreshCookie(response: Response, refreshToken: string) {
    response.cookie(REFRESH_COOKIE, refreshToken, {
      ...this.cookieOptions(),
      maxAge:
        this.configService.get('auth.sessionTtlDays', { infer: true }) *
        86_400_000,
    });
  }

  private cookieOptions() {
    return {
      httpOnly: true,
      path: '/api/auth',
      sameSite: 'lax' as const,
      secure:
        this.configService.get('app.environment', { infer: true }) ===
        'production',
    };
  }
}
