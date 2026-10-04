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
exports.BulkEditController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const require_project_access_decorator_1 = require("../auth/decorators/require-project-access.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const bulk_edit_dto_1 = require("./bulk-edit.dto");
const bulk_edit_service_1 = require("./bulk-edit.service");
let BulkEditController = class BulkEditController {
    service;
    constructor(service) {
        this.service = service;
    }
    fields(projetoId) {
        return this.service.fields(projetoId);
    }
    apply(projetoId, dto) {
        return this.service.apply(projetoId, dto);
    }
};
exports.BulkEditController = BulkEditController;
__decorate([
    (0, common_1.Get)('campos'),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BulkEditController.prototype, "fields", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bulk_edit_dto_1.BulkEditDto]),
    __metadata("design:returntype", void 0)
], BulkEditController.prototype, "apply", null);
exports.BulkEditController = BulkEditController = __decorate([
    (0, common_1.Controller)('projetos/:projetoId/edicao-em-massa'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __metadata("design:paramtypes", [bulk_edit_service_1.BulkEditService])
], BulkEditController);
//# sourceMappingURL=bulk-edit.controller.js.map