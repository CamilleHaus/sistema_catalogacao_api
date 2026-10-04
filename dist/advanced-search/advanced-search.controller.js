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
exports.AdvancedSearchController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const require_project_access_decorator_1 = require("../auth/decorators/require-project-access.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const advanced_search_dto_1 = require("./advanced-search.dto");
const advanced_search_service_1 = require("./advanced-search.service");
let AdvancedSearchController = class AdvancedSearchController {
    service;
    constructor(service) {
        this.service = service;
    }
    fields(projetoId) {
        return this.service.fields(projetoId);
    }
    search(projetoId, dto) {
        return this.service.search(projetoId, dto);
    }
    listFilters(user, projetoId) {
        return this.service.listFilters(projetoId, user.id);
    }
    createFilter(user, projetoId, dto) {
        return this.service.createFilter(projetoId, user.id, dto);
    }
    updateFilter(user, projetoId, filtroId, dto) {
        return this.service.updateFilter(projetoId, user.id, filtroId, dto);
    }
    removeFilter(user, projetoId, filtroId) {
        return this.service.removeFilter(projetoId, user.id, filtroId);
    }
};
exports.AdvancedSearchController = AdvancedSearchController;
__decorate([
    (0, common_1.Get)('campos'),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdvancedSearchController.prototype, "fields", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, advanced_search_dto_1.AdvancedSearchDto]),
    __metadata("design:returntype", void 0)
], AdvancedSearchController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('filtros'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdvancedSearchController.prototype, "listFilters", null);
__decorate([
    (0, common_1.Post)('filtros'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, advanced_search_dto_1.SaveSearchFilterDto]),
    __metadata("design:returntype", void 0)
], AdvancedSearchController.prototype, "createFilter", null);
__decorate([
    (0, common_1.Put)('filtros/:filtroId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('filtroId', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, advanced_search_dto_1.SaveSearchFilterDto]),
    __metadata("design:returntype", void 0)
], AdvancedSearchController.prototype, "updateFilter", null);
__decorate([
    (0, common_1.Delete)('filtros/:filtroId'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('filtroId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AdvancedSearchController.prototype, "removeFilter", null);
exports.AdvancedSearchController = AdvancedSearchController = __decorate([
    (0, common_1.Controller)('projetos/:projetoId/busca-avancada'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.VISUALIZAR),
    __metadata("design:paramtypes", [advanced_search_service_1.AdvancedSearchService])
], AdvancedSearchController);
//# sourceMappingURL=advanced-search.controller.js.map