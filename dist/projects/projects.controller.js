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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const create_project_dto_1 = require("./dto/create-project.dto");
const list_projects_query_dto_1 = require("./dto/list-projects-query.dto");
const reactivate_project_dto_1 = require("./dto/reactivate-project.dto");
const update_project_users_dto_1 = require("./dto/update-project-users.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const projects_service_1 = require("./projects.service");
let ProjectsController = class ProjectsController {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    list(currentUser, query) {
        return this.projectsService.list(currentUser, query);
    }
    create(currentUser, dto) {
        return this.projectsService.create(currentUser, dto);
    }
    reactivationPreview(currentUser, projetoId) {
        return this.projectsService.reactivationPreview(currentUser, projetoId);
    }
    reactivate(currentUser, projetoId, dto) {
        return this.projectsService.reactivate(currentUser, projetoId, dto);
    }
    archive(currentUser, projetoId) {
        return this.projectsService.archive(currentUser, projetoId);
    }
    listUsers(currentUser, projetoId) {
        return this.projectsService.listUsers(currentUser, projetoId);
    }
    updateUsers(currentUser, projetoId, dto) {
        return this.projectsService.updateUsers(currentUser, projetoId, dto);
    }
    findOne(currentUser, projetoId) {
        return this.projectsService.findOne(currentUser, projetoId);
    }
    update(currentUser, projetoId, dto) {
        return this.projectsService.update(currentUser, projetoId, dto);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_projects_query_dto_1.ListProjectsQueryDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':projetoId/reativacao'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "reactivationPreview", null);
__decorate([
    (0, common_1.Post)(':projetoId/reativar'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, reactivate_project_dto_1.ReactivateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Post)(':projetoId/arquivar'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "archive", null);
__decorate([
    (0, common_1.Get)(':projetoId/usuarios'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Put)(':projetoId/usuarios'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_project_users_dto_1.UpdateProjectUsersDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateUsers", null);
__decorate([
    (0, common_1.Get)(':projetoId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':projetoId'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)('projetos'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map