import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { COMPANY_PARAM_KEY } from '../auth.constants';
import type { AuthenticatedRequest } from '../auth.types';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class CompanyAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  canActivate(context: ExecutionContext) {
    const paramName = this.reflector.getAllAndOverride<string>(
      COMPANY_PARAM_KEY,
      [context.getHandler(), context.getClass()],
    );
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const empresaId = paramName ? request.params[paramName] : undefined;

    if (typeof empresaId !== 'string') {
      throw new NotFoundException('Recurso não encontrado.');
    }

    this.authorizationService.assertCompanyAccess(request.user, empresaId);
    return true;
  }
}
