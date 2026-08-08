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
exports.CompanyAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_constants_1 = require("../auth.constants");
const authorization_service_1 = require("../authorization.service");
let CompanyAccessGuard = class CompanyAccessGuard {
    reflector;
    authorizationService;
    constructor(reflector, authorizationService) {
        this.reflector = reflector;
        this.authorizationService = authorizationService;
    }
    canActivate(context) {
        const paramName = this.reflector.getAllAndOverride(auth_constants_1.COMPANY_PARAM_KEY, [context.getHandler(), context.getClass()]);
        const request = context.switchToHttp().getRequest();
        const empresaId = paramName ? request.params[paramName] : undefined;
        if (typeof empresaId !== 'string') {
            throw new common_1.NotFoundException('Recurso não encontrado.');
        }
        this.authorizationService.assertCompanyAccess(request.user, empresaId);
        return true;
    }
};
exports.CompanyAccessGuard = CompanyAccessGuard;
exports.CompanyAccessGuard = CompanyAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        authorization_service_1.AuthorizationService])
], CompanyAccessGuard);
//# sourceMappingURL=company-access.guard.js.map