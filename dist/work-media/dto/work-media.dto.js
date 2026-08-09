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
exports.UpdateWorkAttachmentDto = exports.CreateWorkAttachmentDto = exports.UpdateWorkImageDto = exports.CreateWorkImageDto = void 0;
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateWorkImageDto {
    imagemUrl;
    creditos;
    observacoes;
}
exports.CreateWorkImageDto = CreateWorkImageDto;
__decorate([
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", String)
], CreateWorkImageDto.prototype, "imagemUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], CreateWorkImageDto.prototype, "creditos", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", Object)
], CreateWorkImageDto.prototype, "observacoes", void 0);
class UpdateWorkImageDto {
    imagemUrl;
    creditos;
    observacoes;
}
exports.UpdateWorkImageDto = UpdateWorkImageDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", String)
], UpdateWorkImageDto.prototype, "imagemUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], UpdateWorkImageDto.prototype, "creditos", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", Object)
], UpdateWorkImageDto.prototype, "observacoes", void 0);
class CreateWorkAttachmentDto {
    arquivoUrl;
    tipo;
    observacoes;
}
exports.CreateWorkAttachmentDto = CreateWorkAttachmentDto;
__decorate([
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", String)
], CreateWorkAttachmentDto.prototype, "arquivoUrl", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TipoArquivoAnexo),
    __metadata("design:type", String)
], CreateWorkAttachmentDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", Object)
], CreateWorkAttachmentDto.prototype, "observacoes", void 0);
class UpdateWorkAttachmentDto extends CreateWorkAttachmentDto {
}
exports.UpdateWorkAttachmentDto = UpdateWorkAttachmentDto;
//# sourceMappingURL=work-media.dto.js.map