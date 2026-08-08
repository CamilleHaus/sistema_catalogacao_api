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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const create_user_dto_1 = require("./dto/create-user.dto");
const list_users_query_dto_1 = require("./dto/list-users-query.dto");
const reactivate_user_dto_1 = require("./dto/reactivate-user.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const update_user_projects_dto_1 = require("./dto/update-user-projects.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    list(currentUser, query) {
        return this.usersService.list(currentUser, query);
    }
    create(currentUser, dto) {
        return this.usersService.create(currentUser, dto);
    }
    findOne(currentUser, usuarioId) {
        return this.usersService.findOne(currentUser, usuarioId);
    }
    update(currentUser, usuarioId, dto) {
        return this.usersService.update(currentUser, usuarioId, dto);
    }
    updateRole(currentUser, usuarioId, dto) {
        return this.usersService.updateRole(currentUser, usuarioId, dto);
    }
    deactivate(currentUser, usuarioId) {
        return this.usersService.deactivate(currentUser, usuarioId);
    }
    reactivate(currentUser, usuarioId, dto) {
        return this.usersService.reactivate(currentUser, usuarioId, dto.projetos);
    }
    updateProjects(currentUser, usuarioId, dto) {
        return this.usersService.updateProjects(currentUser, usuarioId, dto);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_users_query_dto_1.ListCompanyUsersQueryDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':usuarioId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('usuarioId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':usuarioId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('usuarioId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':usuarioId/papel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('usuarioId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Post)(':usuarioId/desativar'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('usuarioId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(':usuarioId/reativar'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('usuarioId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, reactivate_user_dto_1.ReactivateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Put)(':usuarioId/projetos'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('usuarioId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_user_projects_dto_1.UpdateUserProjectsDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateProjects", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('usuarios'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map