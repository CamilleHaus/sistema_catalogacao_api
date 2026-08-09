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
exports.WorkMediaController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const require_project_access_decorator_1 = require("../auth/decorators/require-project-access.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const work_media_dto_1 = require("./dto/work-media.dto");
const work_media_service_1 = require("./work-media.service");
let WorkMediaController = class WorkMediaController {
    service;
    constructor(service) {
        this.service = service;
    }
    gallery(p, w) {
        return this.service.gallery(p, w);
    }
    createImage(p, w, dto) {
        return this.service.createImage(p, w, dto);
    }
    updateImage(p, w, id, dto) {
        return this.service.updateImage(p, w, id, dto);
    }
    setMain(p, w, id) {
        return this.service.setMain(p, w, id);
    }
    removeImage(p, w, id) {
        return this.service.removeImage(p, w, id);
    }
    attachments(p, w) {
        return this.service.listAttachments(p, w);
    }
    createAttachment(p, w, dto) {
        return this.service.createAttachment(p, w, dto);
    }
    updateAttachment(p, w, id, dto) {
        return this.service.updateAttachment(p, w, id, dto);
    }
    removeAttachment(p, w, id) {
        return this.service.removeAttachment(p, w, id);
    }
};
exports.WorkMediaController = WorkMediaController;
__decorate([
    (0, common_1.Get)('galeria'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.VISUALIZAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WorkMediaController.prototype, "gallery", null);
__decorate([
    (0, common_1.Post)('imagens'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, work_media_dto_1.CreateWorkImageDto]),
    __metadata("design:returntype", void 0)
], WorkMediaController.prototype, "createImage", null);
__decorate([
    (0, common_1.Patch)('imagens/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, work_media_dto_1.UpdateWorkImageDto]),
    __metadata("design:returntype", void 0)
], WorkMediaController.prototype, "updateImage", null);
__decorate([
    (0, common_1.Patch)('imagens/:id/principal'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WorkMediaController.prototype, "setMain", null);
__decorate([
    (0, common_1.Delete)('imagens/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WorkMediaController.prototype, "removeImage", null);
__decorate([
    (0, common_1.Get)('anexos'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.VISUALIZAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WorkMediaController.prototype, "attachments", null);
__decorate([
    (0, common_1.Post)('anexos'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, work_media_dto_1.CreateWorkAttachmentDto]),
    __metadata("design:returntype", void 0)
], WorkMediaController.prototype, "createAttachment", null);
__decorate([
    (0, common_1.Patch)('anexos/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, work_media_dto_1.UpdateWorkAttachmentDto]),
    __metadata("design:returntype", void 0)
], WorkMediaController.prototype, "updateAttachment", null);
__decorate([
    (0, common_1.Delete)('anexos/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WorkMediaController.prototype, "removeAttachment", null);
exports.WorkMediaController = WorkMediaController = __decorate([
    (0, common_1.Controller)('projetos/:projetoId/obras/:obraId'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    __metadata("design:paramtypes", [work_media_service_1.WorkMediaService])
], WorkMediaController);
//# sourceMappingURL=work-media.controller.js.map