"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireCompanyAccess = void 0;
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("../auth.constants");
const company_access_guard_1 = require("../guards/company-access.guard");
const RequireCompanyAccess = (paramName = 'empresaId') => (0, common_1.applyDecorators)((0, common_1.SetMetadata)(auth_constants_1.COMPANY_PARAM_KEY, paramName), (0, common_1.UseGuards)(company_access_guard_1.CompanyAccessGuard));
exports.RequireCompanyAccess = RequireCompanyAccess;
//# sourceMappingURL=require-company-access.decorator.js.map