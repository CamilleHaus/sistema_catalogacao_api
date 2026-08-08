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
exports.CreateCertificateDto = exports.CreateSignatureDto = exports.SaveTagDto = exports.SaveNameDto = exports.SaveCatalogingDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class SaveCatalogingDto {
    categoriaId;
    proveniencia;
    observacoes;
    tagIds;
}
exports.SaveCatalogingDto = SaveCatalogingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", Object)
], SaveCatalogingDto.prototype, "categoriaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", Object)
], SaveCatalogingDto.prototype, "proveniencia", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", Object)
], SaveCatalogingDto.prototype, "observacoes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], SaveCatalogingDto.prototype, "tagIds", void 0);
class SaveNameDto {
    nome;
}
exports.SaveNameDto = SaveNameDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], SaveNameDto.prototype, "nome", void 0);
class SaveTagDto extends SaveNameDto {
    cor;
}
exports.SaveTagDto = SaveTagDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", Object)
], SaveTagDto.prototype, "cor", void 0);
class CreateSignatureDto {
    localAssinaturaId;
    imagemUrl;
}
exports.CreateSignatureDto = CreateSignatureDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSignatureDto.prototype, "localAssinaturaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", Object)
], CreateSignatureDto.prototype, "imagemUrl", void 0);
class CreateCertificateDto {
    imagemUrl;
    observacoes;
}
exports.CreateCertificateDto = CreateCertificateDto;
__decorate([
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", String)
], CreateCertificateDto.prototype, "imagemUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", Object)
], CreateCertificateDto.prototype, "observacoes", void 0);
//# sourceMappingURL=cataloging.dto.js.map