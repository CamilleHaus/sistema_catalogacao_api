"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireProjectAccess = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const auth_constants_1 = require("../auth.constants");
const project_access_guard_1 = require("../guards/project-access.guard");
const RequireProjectAccess = (permissao = client_1.PermissaoProjeto.VISUALIZAR, paramName = 'projetoId') => (0, common_1.applyDecorators)((0, common_1.SetMetadata)(auth_constants_1.PROJECT_PARAM_KEY, paramName), (0, common_1.SetMetadata)(auth_constants_1.PROJECT_PERMISSION_KEY, permissao), (0, common_1.UseGuards)(project_access_guard_1.ProjectAccessGuard));
exports.RequireProjectAccess = RequireProjectAccess;
//# sourceMappingURL=require-project-access.decorator.js.map