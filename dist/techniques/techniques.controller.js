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
exports.TechniquesController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const create_technique_dto_1 = require("./dto/create-technique.dto");
const list_techniques_query_dto_1 = require("./dto/list-techniques-query.dto");
const update_technique_dto_1 = require("./dto/update-technique.dto");
const techniques_service_1 = require("./techniques.service");
let TechniquesController = class TechniquesController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(user, query) {
        return this.service.list(user, query);
    }
    create(user, dto) {
        return this.service.create(user, dto);
    }
    update(user, id, dto) {
        return this.service.update(user, id, dto);
    }
};
exports.TechniquesController = TechniquesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_techniques_query_dto_1.ListTechniquesQueryDto]),
    __metadata("design:returntype", void 0)
], TechniquesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_technique_dto_1.CreateTechniqueDto]),
    __metadata("design:returntype", void 0)
], TechniquesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':tecnicaId'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tecnicaId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_technique_dto_1.UpdateTechniqueDto]),
    __metadata("design:returntype", void 0)
], TechniquesController.prototype, "update", null);
exports.TechniquesController = TechniquesController = __decorate([
    (0, common_1.Controller)('tecnicas'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    __metadata("design:paramtypes", [techniques_service_1.TechniquesService])
], TechniquesController);
//# sourceMappingURL=techniques.controller.js.map