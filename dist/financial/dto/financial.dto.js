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
exports.SaveInsuranceDto = exports.SaveEvaluationDto = exports.SaveDocumentDto = exports.SaveTransactionDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const trim = ({ value }) => typeof value === 'string' ? value.trim() : value;
class SaveTransactionDto {
    formaNegociacaoId;
    data;
    contraparte;
    moeda;
    valor;
    tipoDesconto;
    desconto;
}
exports.SaveTransactionDto = SaveTransactionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", Object)
], SaveTransactionDto.prototype, "formaNegociacaoId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", Object)
], SaveTransactionDto.prototype, "data", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], SaveTransactionDto.prototype, "contraparte", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Moeda),
    __metadata("design:type", Object)
], SaveTransactionDto.prototype, "moeda", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Object)
], SaveTransactionDto.prototype, "valor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TipoDesconto),
    __metadata("design:type", Object)
], SaveTransactionDto.prototype, "tipoDesconto", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Object)
], SaveTransactionDto.prototype, "desconto", void 0);
class SaveDocumentDto {
    imagemUrl;
    numero;
    data;
    moeda;
    valor;
    comentarios;
}
exports.SaveDocumentDto = SaveDocumentDto;
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", Object)
], SaveDocumentDto.prototype, "imagemUrl", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", Object)
], SaveDocumentDto.prototype, "numero", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    __metadata("design:type", Object)
], SaveDocumentDto.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Moeda),
    __metadata("design:type", Object)
], SaveDocumentDto.prototype, "moeda", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Object)
], SaveDocumentDto.prototype, "valor", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", Object)
], SaveDocumentDto.prototype, "comentarios", void 0);
class SaveEvaluationDto {
    data;
    moeda;
    valor;
    avaliador;
    comentarios;
}
exports.SaveEvaluationDto = SaveEvaluationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    __metadata("design:type", Object)
], SaveEvaluationDto.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Moeda),
    __metadata("design:type", Object)
], SaveEvaluationDto.prototype, "moeda", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Object)
], SaveEvaluationDto.prototype, "valor", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], SaveEvaluationDto.prototype, "avaliador", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", Object)
], SaveEvaluationDto.prototype, "comentarios", void 0);
class SaveInsuranceDto {
    vigencia;
    moeda;
    valor;
    modalidadeSeguroId;
    observacoes;
}
exports.SaveInsuranceDto = SaveInsuranceDto;
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], SaveInsuranceDto.prototype, "vigencia", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Moeda),
    __metadata("design:type", Object)
], SaveInsuranceDto.prototype, "moeda", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Object)
], SaveInsuranceDto.prototype, "valor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", Object)
], SaveInsuranceDto.prototype, "modalidadeSeguroId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", Object)
], SaveInsuranceDto.prototype, "observacoes", void 0);
//# sourceMappingURL=financial.dto.js.map