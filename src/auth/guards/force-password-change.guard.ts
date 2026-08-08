import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ALLOW_DURING_PASSWORD_CHANGE_KEY,
  IS_PUBLIC_KEY,
} from '../auth.constants';
import type { AuthenticatedRequest } from '../auth.types';

@Injectable()
export class ForcePasswordChangeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isAllowed = this.reflector.getAllAndOverride<boolean>(
      ALLOW_DURING_PASSWORD_CHANGE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic || isAllowed) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (request.user.deveAlterarSenha) {
      throw new ForbiddenException({
        code: 'PASSWORD_CHANGE_REQUIRED',
        message: 'É necessário alterar a senha antes de continuar.',
      });
    }

    return true;
  }
}
