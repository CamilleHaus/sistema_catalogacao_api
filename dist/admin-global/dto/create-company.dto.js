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
exports.CreateCompanyDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CompanyDataDto {
    nome;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CompanyDataDto.prototype, "nome", void 0);
class FirstAdminDataDto {
    nome;
    email;
    cpf;
    senhaTemporaria;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], FirstAdminDataDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], FirstAdminDataDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FirstAdminDataDto.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], FirstAdminDataDto.prototype, "senhaTemporaria", void 0);
class CreateCompanyDto {
    empresa;
    administrador;
}
exports.CreateCompanyDto = CreateCompanyDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CompanyDataDto),
    __metadata("design:type", CompanyDataDto)
], CreateCompanyDto.prototype, "empresa", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FirstAdminDataDto),
    __metadata("design:type", FirstAdminDataDto)
], CreateCompanyDto.prototype, "administrador", void 0);
//# sourceMappingURL=create-company.dto.js.map