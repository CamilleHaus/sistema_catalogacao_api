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
exports.StorageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const client_1 = require("@prisma/client");
const require_project_access_decorator_1 = require("../auth/decorators/require-project-access.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const storage_service_1 = require("./storage.service");
let StorageController = class StorageController {
    service;
    constructor(service) {
        this.service = service;
    }
    upload(projetoId, file) {
        if (!file)
            throw new common_1.BadRequestException('Envie um arquivo em "arquivo".');
        return this.service.upload(file, `projetos/${projetoId}`);
    }
};
exports.StorageController = StorageController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('arquivo')),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StorageController.prototype, "upload", null);
exports.StorageController = StorageController = __decorate([
    (0, common_1.Controller)('projetos/:projetoId/arquivos'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], StorageController);
//# sourceMappingURL=storage.controller.js.map