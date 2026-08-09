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
exports.WorkPhotosController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const require_project_access_decorator_1 = require("../auth/decorators/require-project-access.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const update_work_photo_dto_1 = require("./dto/update-work-photo.dto");
const work_photos_service_1 = require("./work-photos.service");
let WorkPhotosController = class WorkPhotosController {
    service;
    constructor(service) {
        this.service = service;
    }
    update(projetoId, obraId, dto) {
        return this.service.update(projetoId, obraId, dto.url, dto.creditos);
    }
    remove(projetoId, obraId) {
        return this.service.remove(projetoId, obraId);
    }
};
exports.WorkPhotosController = WorkPhotosController;
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_work_photo_dto_1.UpdateWorkPhotoDto]),
    __metadata("design:returntype", void 0)
], WorkPhotosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WorkPhotosController.prototype, "remove", null);
exports.WorkPhotosController = WorkPhotosController = __decorate([
    (0, common_1.Controller)('projetos/:projetoId/obras/:obraId/foto-principal'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __metadata("design:paramtypes", [work_photos_service_1.WorkPhotosService])
], WorkPhotosController);
//# sourceMappingURL=work-photos.controller.js.map