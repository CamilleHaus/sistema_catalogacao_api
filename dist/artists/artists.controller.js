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
exports.ArtistsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const artists_service_1 = require("./artists.service");
const create_artist_dto_1 = require("./dto/create-artist.dto");
const update_artist_dto_1 = require("./dto/update-artist.dto");
let ArtistsController = class ArtistsController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(user) {
        return this.service.list(user);
    }
    findOne(user, id) {
        return this.service.findOne(user, id);
    }
    create(user, dto) {
        return this.service.create(user, dto);
    }
    update(user, id, dto) {
        return this.service.update(user, id, dto);
    }
};
exports.ArtistsController = ArtistsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':artistaId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('artistaId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_artist_dto_1.CreateArtistDto]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':artistaId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('artistaId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_artist_dto_1.UpdateArtistDto]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "update", null);
exports.ArtistsController = ArtistsController = __decorate([
    (0, common_1.Controller)('artistas'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    __metadata("design:paramtypes", [artists_service_1.ArtistsService])
], ArtistsController);
//# sourceMappingURL=artists.controller.js.map