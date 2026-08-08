import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissaoProjeto } from '@prisma/client';
import { PROJECT_PARAM_KEY, PROJECT_PERMISSION_KEY } from '../auth.constants';
import type { AuthenticatedRequest } from '../auth.types';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const paramName = this.reflector.getAllAndOverride<string>(
      PROJECT_PARAM_KEY,
      [context.getHandler(), context.getClass()],
    );
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const permissao =
      this.reflector.getAllAndOverride<PermissaoProjeto>(
        PROJECT_PERMISSION_KEY,
        [context.getHandler(), context.getClass()],
      ) ?? PermissaoProjeto.VISUALIZAR;
    const projetoId = paramName ? request.params[paramName] : undefined;

    if (typeof projetoId !== 'string') {
      throw new NotFoundException('Projeto não encontrado.');
    }

    await this.authorizationService.assertProjectAccess(
      request.user,
      projetoId,
      permissao,
    );
    return true;
  }
}
