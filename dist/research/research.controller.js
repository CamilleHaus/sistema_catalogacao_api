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
exports.ResearchController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const require_project_access_decorator_1 = require("../auth/decorators/require-project-access.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const research_dto_1 = require("./dto/research.dto");
const research_service_1 = require("./research.service");
let ResearchController = class ResearchController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(p, w) {
        return this.service.list(p, w);
    }
    createCurriculum(p, w, dto) {
        return this.service.createCurriculum(p, w, dto);
    }
    updateCurriculum(p, w, id, dto) {
        return this.service.updateCurriculum(p, w, id, dto);
    }
    removeCurriculum(p, w, id) {
        return this.service.removeCurriculum(p, w, id);
    }
    createPublication(p, w, dto) {
        return this.service.createPublication(p, w, dto);
    }
    updatePublication(p, w, id, dto) {
        return this.service.updatePublication(p, w, id, dto);
    }
    removePublication(p, w, id) {
        return this.service.removePublication(p, w, id);
    }
    addImage(p, w, id, dto) {
        return this.service.addPublicationImage(p, w, id, dto);
    }
    removeImage(p, w, id, imageId) {
        return this.service.removePublicationImage(p, w, id, imageId);
    }
    createMuseum(p, w, dto) {
        return this.service.createMuseumResearch(p, w, dto);
    }
    updateMuseum(p, w, id, dto) {
        return this.service.updateMuseumResearch(p, w, id, dto);
    }
    removeMuseum(p, w, id) {
        return this.service.removeMuseumResearch(p, w, id);
    }
};
exports.ResearchController = ResearchController;
__decorate([
    (0, common_1.Get)(),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.VISUALIZAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('curriculos'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, research_dto_1.SaveCurriculumDto]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "createCurriculum", null);
__decorate([
    (0, common_1.Patch)('curriculos/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, research_dto_1.SaveCurriculumDto]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "updateCurriculum", null);
__decorate([
    (0, common_1.Delete)('curriculos/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "removeCurriculum", null);
__decorate([
    (0, common_1.Post)('publicacoes'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, research_dto_1.SavePublicationDto]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "createPublication", null);
__decorate([
    (0, common_1.Patch)('publicacoes/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, research_dto_1.SavePublicationDto]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "updatePublication", null);
__decorate([
    (0, common_1.Delete)('publicacoes/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "removePublication", null);
__decorate([
    (0, common_1.Post)('publicacoes/:id/imagens'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, research_dto_1.AddPublicationImageDto]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "addImage", null);
__decorate([
    (0, common_1.Delete)('publicacoes/:id/imagens/:imageId'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Param)('imageId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "removeImage", null);
__decorate([
    (0, common_1.Post)('museologicas'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, research_dto_1.SaveMuseumResearchDto]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "createMuseum", null);
__decorate([
    (0, common_1.Patch)('museologicas/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, research_dto_1.SaveMuseumResearchDto]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "updateMuseum", null);
__decorate([
    (0, common_1.Delete)('museologicas/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "removeMuseum", null);
exports.ResearchController = ResearchController = __decorate([
    (0, common_1.Controller)('projetos/:projetoId/obras/:obraId/pesquisa'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    __metadata("design:paramtypes", [research_service_1.ResearchService])
], ResearchController);
//# sourceMappingURL=research.controller.js.map