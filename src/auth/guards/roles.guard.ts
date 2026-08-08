import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { PapelUsuario } from '@prisma/client';
import { IS_PUBLIC_KEY, ROLES_KEY } from '../auth.constants';
import type { AuthenticatedRequest } from '../auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const roles = this.reflector.getAllAndOverride<PapelUsuario[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || !roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!roles.includes(request.user.papel)) {
      throw new ForbiddenException(
        'Você não possui permissão para esta operação.',
      );
    }

    return true;
  }
}
