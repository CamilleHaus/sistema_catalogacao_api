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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProjectAccessDto = exports.ProjectAccessDto = void 0;
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class ProjectAccessDto {
    projetoId;
    permissao;
}
exports.ProjectAccessDto = ProjectAccessDto;
__decorate([
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], ProjectAccessDto.prototype, "projetoId", void 0);
__decorate([
    (0, class_validator_1.IsIn)([client_1.PermissaoProjeto.VISUALIZAR, client_1.PermissaoProjeto.EDITAR]),
    __metadata("design:type", String)
], ProjectAccessDto.prototype, "permissao", void 0);
class UserProjectAccessDto {
    usuarioId;
    permissao;
}
exports.UserProjectAccessDto = UserProjectAccessDto;
__decorate([
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], UserProjectAccessDto.prototype, "usuarioId", void 0);
__decorate([
    (0, class_validator_1.IsIn)([client_1.PermissaoProjeto.VISUALIZAR, client_1.PermissaoProjeto.EDITAR]),
    __metadata("design:type", String)
], UserProjectAccessDto.prototype, "permissao", void 0);
//# sourceMappingURL=project-access.dto.js.map