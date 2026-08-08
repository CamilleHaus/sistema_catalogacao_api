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
exports.AdminGlobalController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const admin_global_service_1 = require("./admin-global.service");
const create_company_dto_1 = require("./dto/create-company.dto");
const list_users_query_dto_1 = require("./dto/list-users-query.dto");
const update_admin_status_dto_1 = require("./dto/update-admin-status.dto");
let AdminGlobalController = class AdminGlobalController {
    adminGlobalService;
    constructor(adminGlobalService) {
        this.adminGlobalService = adminGlobalService;
    }
    createCompany(dto) {
        return this.adminGlobalService.createCompany(dto);
    }
    listCompanies() {
        return this.adminGlobalService.listCompanies();
    }
    listUsers(query) {
        return this.adminGlobalService.listUsers(query);
    }
    resetPassword(usuarioId) {
        return this.adminGlobalService.resetPassword(usuarioId);
    }
    updateCompanyAdminStatus(usuarioId, dto) {
        return this.adminGlobalService.updateCompanyAdminStatus(usuarioId, dto.ativo);
    }
};
exports.AdminGlobalController = AdminGlobalController;
__decorate([
    (0, common_1.Post)('empresas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", void 0)
], AdminGlobalController.prototype, "createCompany", null);
__decorate([
    (0, common_1.Get)('empresas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminGlobalController.prototype, "listCompanies", null);
__decorate([
    (0, common_1.Get)('usuarios'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_users_query_dto_1.ListUsersQueryDto]),
    __metadata("design:returntype", void 0)
], AdminGlobalController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Post)('usuarios/:usuarioId/reset-senha'),
    __param(0, (0, common_1.Param)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminGlobalController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Patch)('admins-empresa/:usuarioId/status'),
    __param(0, (0, common_1.Param)('usuarioId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_status_dto_1.UpdateAdminStatusDto]),
    __metadata("design:returntype", void 0)
], AdminGlobalController.prototype, "updateCompanyAdminStatus", null);
exports.AdminGlobalController = AdminGlobalController = __decorate([
    (0, common_1.Controller)('admin-global'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_GLOBAL),
    __metadata("design:paramtypes", [admin_global_service_1.AdminGlobalService])
], AdminGlobalController);
//# sourceMappingURL=admin-global.controller.js.map