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
exports.ReferenceDataController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const cataloging_dto_1 = require("./dto/cataloging.dto");
const reference_data_service_1 = require("./reference-data.service");
let ReferenceDataController = class ReferenceDataController {
    service;
    constructor(service) {
        this.service = service;
    }
    categories(user) {
        return this.service.list(user, 'categoria');
    }
    createCategory(user, dto) {
        return this.service.create(user, 'categoria', dto);
    }
    updateCategory(user, id, dto) {
        return this.service.update(user, 'categoria', id, dto);
    }
    tags(user) {
        return this.service.list(user, 'tag');
    }
    createTag(user, dto) {
        return this.service.create(user, 'tag', dto);
    }
    updateTag(user, id, dto) {
        return this.service.update(user, 'tag', id, dto);
    }
    locations(user) {
        return this.service.list(user, 'local');
    }
    createLocation(user, dto) {
        return this.service.create(user, 'local', dto);
    }
    updateLocation(user, id, dto) {
        return this.service.update(user, 'local', id, dto);
    }
    negotiationForms(user) {
        return this.service.list(user, 'forma');
    }
    createNegotiationForm(user, dto) {
        return this.service.create(user, 'forma', dto);
    }
    updateNegotiationForm(user, id, dto) {
        return this.service.update(user, 'forma', id, dto);
    }
    insuranceTypes(user) {
        return this.service.list(user, 'modalidade');
    }
    createInsuranceType(user, dto) {
        return this.service.create(user, 'modalidade', dto);
    }
    updateInsuranceType(user, id, dto) {
        return this.service.update(user, 'modalidade', id, dto);
    }
};
exports.ReferenceDataController = ReferenceDataController;
__decorate([
    (0, common_1.Get)('categorias-catalogacao'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "categories", null);
__decorate([
    (0, common_1.Post)('categorias-catalogacao'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cataloging_dto_1.SaveNameDto]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categorias-catalogacao/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, cataloging_dto_1.SaveNameDto]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Get)('tags'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "tags", null);
__decorate([
    (0, common_1.Post)('tags'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cataloging_dto_1.SaveTagDto]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "createTag", null);
__decorate([
    (0, common_1.Patch)('tags/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, cataloging_dto_1.SaveTagDto]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "updateTag", null);
__decorate([
    (0, common_1.Get)('locais-assinatura'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "locations", null);
__decorate([
    (0, common_1.Post)('locais-assinatura'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cataloging_dto_1.SaveNameDto]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "createLocation", null);
__decorate([
    (0, common_1.Patch)('locais-assinatura/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, cataloging_dto_1.SaveNameDto]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Get)('formas-negociacao'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "negotiationForms", null);
__decorate([
    (0, common_1.Post)('formas-negociacao'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cataloging_dto_1.SaveNameDto]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "createNegotiationForm", null);
__decorate([
    (0, common_1.Patch)('formas-negociacao/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, cataloging_dto_1.SaveNameDto]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "updateNegotiationForm", null);
__decorate([
    (0, common_1.Get)('modalidades-seguro'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "insuranceTypes", null);
__decorate([
    (0, common_1.Post)('modalidades-seguro'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cataloging_dto_1.SaveNameDto]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "createInsuranceType", null);
__decorate([
    (0, common_1.Patch)('modalidades-seguro/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, cataloging_dto_1.SaveNameDto]),
    __metadata("design:returntype", void 0)
], ReferenceDataController.prototype, "updateInsuranceType", null);
exports.ReferenceDataController = ReferenceDataController = __decorate([
    (0, common_1.Controller)(),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    __metadata("design:paramtypes", [reference_data_service_1.ReferenceDataService])
], ReferenceDataController);
//# sourceMappingURL=reference-data.controller.js.map