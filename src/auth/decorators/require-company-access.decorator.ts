import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { COMPANY_PARAM_KEY } from '../auth.constants';
import { CompanyAccessGuard } from '../guards/company-access.guard';

export const RequireCompanyAccess = (paramName = 'empresaId') =>
  applyDecorators(
    SetMetadata(COMPANY_PARAM_KEY, paramName),
    UseGuards(CompanyAccessGuard),
  );
