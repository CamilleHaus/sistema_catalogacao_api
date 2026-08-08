import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './auth.types';
import { IS_PUBLIC_KEY } from './auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Autenticação necessária.');
    }

    const user = await this.authService.authenticateAccessToken(token);
    (request as AuthenticatedRequest).user = user;

    return true;
  }
}
