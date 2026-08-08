import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { AppConfig } from '../../config/app.config';

@Injectable()
export class RefreshOriginGuard implements CanActivate {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const allowedOrigin = this.configService.get('app.webOrigin', {
      infer: true,
    });

    if (request.headers.origin !== allowedOrigin) {
      throw new ForbiddenException({
        code: 'INVALID_REQUEST_ORIGIN',
        message: 'Origem da requisição não autorizada.',
      });
    }

    return true;
  }
}
