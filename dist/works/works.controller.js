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
exports.WorksController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const require_project_access_decorator_1 = require("../auth/decorators/require-project-access.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const create_work_dto_1 = require("./dto/create-work.dto");
const list_works_query_dto_1 = require("./dto/list-works-query.dto");
const update_work_dto_1 = require("./dto/update-work.dto");
const works_service_1 = require("./works.service");
let WorksController = class WorksController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(projetoId, query) {
        return this.service.list(projetoId, query);
    }
    findOne(projetoId, obraId) {
        return this.service.findOne(projetoId, obraId);
    }
    create(projetoId, dto) {
        return this.service.create(projetoId, dto);
    }
    update(projetoId, obraId, dto) {
        return this.service.update(projetoId, obraId, dto);
    }
};
exports.WorksController = WorksController;
__decorate([
    (0, common_1.Get)(),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.VISUALIZAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, list_works_query_dto_1.ListWorksQueryDto]),
    __metadata("design:returntype", void 0)
], WorksController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':obraId'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.VISUALIZAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WorksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_work_dto_1.CreateWorkDto]),
    __metadata("design:returntype", void 0)
], WorksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':obraId'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_work_dto_1.UpdateWorkDto]),
    __metadata("design:returntype", void 0)
], WorksController.prototype, "update", null);
exports.WorksController = WorksController = __decorate([
    (0, common_1.Controller)('projetos/:projetoId/obras'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    __metadata("design:paramtypes", [works_service_1.WorksService])
], WorksController);
//# sourceMappingURL=works.controller.js.map