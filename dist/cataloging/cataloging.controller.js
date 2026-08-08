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
exports.CatalogingController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const require_project_access_decorator_1 = require("../auth/decorators/require-project-access.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const cataloging_service_1 = require("./cataloging.service");
const cataloging_dto_1 = require("./dto/cataloging.dto");
let CatalogingController = class CatalogingController {
    service;
    constructor(service) {
        this.service = service;
    }
    get(project, work) {
        return this.service.get(project, work);
    }
    save(project, work, dto) {
        return this.service.save(project, work, dto);
    }
    addSignature(p, w, dto) {
        return this.service.addSignature(p, w, dto);
    }
    updateSignature(p, w, id, dto) {
        return this.service.updateSignature(p, w, id, dto);
    }
    removeSignature(p, w, id) {
        return this.service.removeSignature(p, w, id);
    }
    addCertificate(p, w, dto) {
        return this.service.addCertificate(p, w, dto);
    }
    updateCertificate(p, w, id, dto) {
        return this.service.updateCertificate(p, w, id, dto);
    }
    removeCertificate(p, w, id) {
        return this.service.removeCertificate(p, w, id);
    }
};
exports.CatalogingController = CatalogingController;
__decorate([
    (0, common_1.Get)(),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.VISUALIZAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CatalogingController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, cataloging_dto_1.SaveCatalogingDto]),
    __metadata("design:returntype", void 0)
], CatalogingController.prototype, "save", null);
__decorate([
    (0, common_1.Post)('assinaturas'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, cataloging_dto_1.CreateSignatureDto]),
    __metadata("design:returntype", void 0)
], CatalogingController.prototype, "addSignature", null);
__decorate([
    (0, common_1.Patch)('assinaturas/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, cataloging_dto_1.CreateSignatureDto]),
    __metadata("design:returntype", void 0)
], CatalogingController.prototype, "updateSignature", null);
__decorate([
    (0, common_1.Delete)('assinaturas/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CatalogingController.prototype, "removeSignature", null);
__decorate([
    (0, common_1.Post)('certificados'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, cataloging_dto_1.CreateCertificateDto]),
    __metadata("design:returntype", void 0)
], CatalogingController.prototype, "addCertificate", null);
__decorate([
    (0, common_1.Patch)('certificados/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, cataloging_dto_1.CreateCertificateDto]),
    __metadata("design:returntype", void 0)
], CatalogingController.prototype, "updateCertificate", null);
__decorate([
    (0, common_1.Delete)('certificados/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CatalogingController.prototype, "removeCertificate", null);
exports.CatalogingController = CatalogingController = __decorate([
    (0, common_1.Controller)('projetos/:projetoId/obras/:obraId/catalogacao'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    __metadata("design:paramtypes", [cataloging_service_1.CatalogingService])
], CatalogingController);
//# sourceMappingURL=cataloging.controller.js.map