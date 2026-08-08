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
exports.AddPublicationImageDto = exports.SaveMuseumResearchDto = exports.SavePublicationDto = exports.SaveCurriculumDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const trim = ({ value }) => typeof value === 'string' ? value.trim() : value;
class OptionalTextDto {
    titulo;
}
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], OptionalTextDto.prototype, "titulo", void 0);
class SaveCurriculumDto {
    nomeExposicao;
    instituicao;
    cidade;
    pais;
    data;
}
exports.SaveCurriculumDto = SaveCurriculumDto;
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], SaveCurriculumDto.prototype, "nomeExposicao", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], SaveCurriculumDto.prototype, "instituicao", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", Object)
], SaveCurriculumDto.prototype, "cidade", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", Object)
], SaveCurriculumDto.prototype, "pais", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", Object)
], SaveCurriculumDto.prototype, "data", void 0);
class SavePublicationDto extends OptionalTextDto {
    ano;
    autor;
    editora;
    pagina;
    imagens;
}
exports.SavePublicationDto = SavePublicationDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === '' || value === undefined
        ? value
        : Number(value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(9999),
    __metadata("design:type", Object)
], SavePublicationDto.prototype, "ano", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], SavePublicationDto.prototype, "autor", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], SavePublicationDto.prototype, "editora", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", Object)
], SavePublicationDto.prototype, "pagina", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!Array.isArray(value))
            return value;
        const items = value;
        return items
            .map((item) => (typeof item === 'string' ? item.trim() : item))
            .filter(Boolean);
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({ require_tld: false }, { each: true, message: 'Informe somente URLs de imagem válidas.' }),
    (0, class_validator_1.MaxLength)(2048, { each: true }),
    __metadata("design:type", Array)
], SavePublicationDto.prototype, "imagens", void 0);
class SaveMuseumResearchDto extends OptionalTextDto {
    descricao;
    url;
}
exports.SaveMuseumResearchDto = SaveMuseumResearchDto;
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", Object)
], SaveMuseumResearchDto.prototype, "descricao", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ require_tld: false }, { message: 'Informe uma URL válida.' }),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", Object)
], SaveMuseumResearchDto.prototype, "url", void 0);
class AddPublicationImageDto {
    imagemUrl;
}
exports.AddPublicationImageDto = AddPublicationImageDto;
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsUrl)({ require_tld: false }, { message: 'Informe uma URL de imagem válida.' }),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", String)
], AddPublicationImageDto.prototype, "imagemUrl", void 0);
//# sourceMappingURL=research.dto.js.map