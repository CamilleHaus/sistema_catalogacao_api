"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementController = exports.ManagementAuxController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const require_project_access_decorator_1 = require("../auth/decorators/require-project-access.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const management_dto_1 = require("./dto/management.dto");
const management_service_1 = require("./management.service");
let ManagementAuxController = class ManagementAuxController {
    s;
    constructor(s) {
        this.s = s;
    }
    list(u) {
        return this.s.auxiliaries(u);
    }
    estado(u, d) {
        return this.s.createAux(u, 'estado', d.nome);
    }
    tipo(u, d) {
        return this.s.createAux(u, 'tipo', d.nome);
    }
    updateEstado(u, id, d) {
        return this.s.updateAux(u, 'estado', id, d.nome);
    }
    updateTipo(u, id, d) {
        return this.s.updateAux(u, 'tipo', id, d.nome);
    }
};
exports.ManagementAuxController = ManagementAuxController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManagementAuxController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('estados-conservacao'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, management_dto_1.NamedDto]),
    __metadata("design:returntype", void 0)
], ManagementAuxController.prototype, "estado", null);
__decorate([
    (0, common_1.Post)('tipos-servico'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, management_dto_1.NamedDto]),
    __metadata("design:returntype", void 0)
], ManagementAuxController.prototype, "tipo", null);
__decorate([
    (0, common_1.Patch)('estados-conservacao/:id'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, management_dto_1.NamedDto]),
    __metadata("design:returntype", void 0)
], ManagementAuxController.prototype, "updateEstado", null);
__decorate([
    (0, common_1.Patch)('tipos-servico/:id'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, management_dto_1.NamedDto]),
    __metadata("design:returntype", void 0)
], ManagementAuxController.prototype, "updateTipo", null);
exports.ManagementAuxController = ManagementAuxController = __decorate([
    (0, common_1.Controller)('gestao-auxiliares'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    __metadata("design:paramtypes", [management_service_1.ManagementService])
], ManagementAuxController);
let ManagementController = class ManagementController {
    s;
    constructor(s) {
        this.s = s;
    }
    get(p, w) {
        return this.s.get(p, w);
    }
    ca(p, w, d) {
        return this.s.createAnalysis(p, w, d);
    }
    ua(p, w, i, d) {
        return this.s.updateAnalysis(p, w, i, d);
    }
    da(p, w, i) {
        return this.s.remove(p, w, 'analise', i);
    }
    ai(p, w, i, d) {
        return this.s.addAnalysisImage(p, w, i, d);
    }
    ui(p, w, i, x, d) {
        return this.s.updateAnalysisImage(p, w, i, x, d);
    }
    di(p, w, i, x) {
        return this.s.removeImage(p, w, 'analise', i, x);
    }
    cr(p, w, d) {
        return this.s.createRestoration(p, w, d);
    }
    ur(p, w, i, d) {
        return this.s.updateRestoration(p, w, i, d);
    }
    dr(p, w, i) {
        return this.s.remove(p, w, 'restauro', i);
    }
    report(p, w, i, d) {
        return this.s.report(p, w, i, d.url);
    }
    delReport(p, w, i) {
        return this.s.removeReport(p, w, i);
    }
    cs(p, w, d) {
        return this.s.createService(p, w, d);
    }
    us(p, w, i, d) {
        return this.s.updateService(p, w, i, d);
    }
    ds(p, w, i) {
        return this.s.remove(p, w, 'servico', i);
    }
    ci(p, w, d) {
        return this.s.createInstruction(p, w, d);
    }
    uin(p, w, i, d) {
        return this.s.updateInstruction(p, w, i, d);
    }
    din(p, w, i) {
        return this.s.remove(p, w, 'instrucao', i);
    }
    ii(p, w, i, d) {
        return this.s.addInstructionImage(p, w, i, d.imagemUrl);
    }
    dix(p, w, i, x) {
        return this.s.removeImage(p, w, 'instrucao', i, x);
    }
    cm(p, w, d) {
        return this.s.createMovement(p, w, d);
    }
    um(p, w, i, d) {
        return this.s.updateMovement(p, w, i, d);
    }
    dm(p, w, i) {
        return this.s.remove(p, w, 'movimentacao', i);
    }
};
exports.ManagementController = ManagementController;
__decorate([
    (0, common_1.Get)(),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.VISUALIZAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "get", null);
__decorate([
    (0, common_1.Post)('analises'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, management_dto_1.AnalysisDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "ca", null);
__decorate([
    (0, common_1.Patch)('analises/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, management_dto_1.AnalysisDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "ua", null);
__decorate([
    (0, common_1.Delete)('analises/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "da", null);
__decorate([
    (0, common_1.Post)('analises/:id/imagens'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, management_dto_1.AnalysisImageDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "ai", null);
__decorate([
    (0, common_1.Patch)('analises/:id/imagens/:imageId'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Param)('imageId', common_1.ParseUUIDPipe)),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, management_dto_1.AnalysisImageDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "ui", null);
__decorate([
    (0, common_1.Delete)('analises/:id/imagens/:imageId'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Param)('imageId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "di", null);
__decorate([
    (0, common_1.Post)('restauros'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, management_dto_1.RestorationDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "cr", null);
__decorate([
    (0, common_1.Patch)('restauros/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, management_dto_1.RestorationDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "ur", null);
__decorate([
    (0, common_1.Delete)('restauros/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "dr", null);
__decorate([
    (0, common_1.Put)('restauros/:id/relatorio'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, management_dto_1.ReportDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "report", null);
__decorate([
    (0, common_1.Delete)('restauros/:id/relatorio'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "delReport", null);
__decorate([
    (0, common_1.Post)('servicos'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, management_dto_1.ServiceDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "cs", null);
__decorate([
    (0, common_1.Patch)('servicos/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, management_dto_1.ServiceDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "us", null);
__decorate([
    (0, common_1.Delete)('servicos/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "ds", null);
__decorate([
    (0, common_1.Post)('instrucoes'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, management_dto_1.InstructionDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "ci", null);
__decorate([
    (0, common_1.Patch)('instrucoes/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, management_dto_1.InstructionDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "uin", null);
__decorate([
    (0, common_1.Delete)('instrucoes/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "din", null);
__decorate([
    (0, common_1.Post)('instrucoes/:id/imagens'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, management_dto_1.InstructionImageDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "ii", null);
__decorate([
    (0, common_1.Delete)('instrucoes/:id/imagens/:imageId'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Param)('imageId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "dix", null);
__decorate([
    (0, common_1.Post)('movimentacoes'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, management_dto_1.MovementDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "cm", null);
__decorate([
    (0, common_1.Patch)('movimentacoes/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, management_dto_1.MovementDto]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "um", null);
__decorate([
    (0, common_1.Delete)('movimentacoes/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('obraId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ManagementController.prototype, "dm", null);
exports.ManagementController = ManagementController = __decorate([
    (0, common_1.Controller)('projetos/:projetoId/obras/:obraId/gestao'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    __metadata("design:paramtypes", [management_service_1.ManagementService])
], ManagementController);
//# sourceMappingURL=management.controller.js.map