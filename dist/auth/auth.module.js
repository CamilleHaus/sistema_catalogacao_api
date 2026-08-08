"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const throttler_1 = require("@nestjs/throttler");
const access_token_guard_1 = require("./access-token.guard");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const authorization_service_1 = require("./authorization.service");
const company_access_guard_1 = require("./guards/company-access.guard");
const project_access_guard_1 = require("./guards/project-access.guard");
const refresh_origin_guard_1 = require("./guards/refresh-origin.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({}),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            access_token_guard_1.AccessTokenGuard,
            authorization_service_1.AuthorizationService,
            company_access_guard_1.CompanyAccessGuard,
            project_access_guard_1.ProjectAccessGuard,
            refresh_origin_guard_1.RefreshOriginGuard,
        ],
        exports: [
            auth_service_1.AuthService,
            authorization_service_1.AuthorizationService,
            company_access_guard_1.CompanyAccessGuard,
            project_access_guard_1.ProjectAccessGuard,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map