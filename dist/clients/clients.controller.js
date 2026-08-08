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
exports.ClientsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const clients_service_1 = require("./clients.service");
const create_client_dto_1 = require("./dto/create-client.dto");
const update_client_dto_1 = require("./dto/update-client.dto");
let ClientsController = class ClientsController {
    clientsService;
    constructor(clientsService) {
        this.clientsService = clientsService;
    }
    list(currentUser) {
        return this.clientsService.list(currentUser);
    }
    create(currentUser, dto) {
        return this.clientsService.create(currentUser, dto);
    }
    findOne(currentUser, clienteId) {
        return this.clientsService.findOne(currentUser, clienteId);
    }
    update(currentUser, clienteId, dto) {
        return this.clientsService.update(currentUser, clienteId, dto);
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_client_dto_1.CreateClientDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':clienteId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('clienteId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':clienteId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('clienteId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_client_dto_1.UpdateClientDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "update", null);
exports.ClientsController = ClientsController = __decorate([
    (0, common_1.Controller)('clientes'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA),
    __metadata("design:paramtypes", [clients_service_1.ClientsService])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map