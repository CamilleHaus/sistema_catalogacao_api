import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissaoProjeto } from '@prisma/client';
import { PROJECT_PARAM_KEY, PROJECT_PERMISSION_KEY } from '../auth.constants';
import { ProjectAccessGuard } from '../guards/project-access.guard';

export const RequireProjectAccess = (
  permissao: PermissaoProjeto = PermissaoProjeto.VISUALIZAR,
  paramName = 'projetoId',
) =>
  applyDecorators(
    SetMetadata(PROJECT_PARAM_KEY, paramName),
    SetMetadata(PROJECT_PERMISSION_KEY, permissao),
    UseGuards(ProjectAccessGuard),
  );
