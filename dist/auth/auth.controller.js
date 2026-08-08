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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const change_password_dto_1 = require("./dto/change-password.dto");
const login_dto_1 = require("./dto/login.dto");
const public_decorator_1 = require("./decorators/public.decorator");
const allow_during_password_change_decorator_1 = require("./decorators/allow-during-password-change.decorator");
const refresh_origin_guard_1 = require("./guards/refresh-origin.guard");
const REFRESH_COOKIE = 'refresh_token';
let AuthController = class AuthController {
    authService;
    configService;
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    async login(dto, request, response) {
        const result = await this.authService.login(dto, {
            userAgent: request.headers['user-agent'],
            ip: request.ip,
        });
        this.setRefreshCookie(response, result.refreshToken);
        return { accessToken: result.accessToken, usuario: result.usuario };
    }
    async refresh(request, response) {
        try {
            const result = await this.authService.refresh(this.readRefreshCookie(request));
            this.setRefreshCookie(response, result.refreshToken);
            return { accessToken: result.accessToken, usuario: result.usuario };
        }
        catch (error) {
            response.clearCookie(REFRESH_COOKIE, this.cookieOptions());
            throw error;
        }
    }
    async logout(request, response) {
        await this.authService.logout(request.user);
        response.clearCookie(REFRESH_COOKIE, this.cookieOptions());
    }
    me(request) {
        return request.user;
    }
    async changePassword(request, dto) {
        return this.authService.changeRequiredPassword(request.user, dto.novaSenha);
    }
    readRefreshCookie(request) {
        const cookies = request.cookies;
        const token = cookies?.[REFRESH_COOKIE];
        return typeof token === 'string' ? token : undefined;
    }
    setRefreshCookie(response, refreshToken) {
        response.cookie(REFRESH_COOKIE, refreshToken, {
            ...this.cookieOptions(),
            maxAge: this.configService.get('auth.sessionTtlDays', { infer: true }) *
                86_400_000,
        });
    }
    cookieOptions() {
        return {
            httpOnly: true,
            path: '/api/auth',
            sameSite: 'lax',
            secure: this.configService.get('app.environment', { infer: true }) ===
                'production',
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60_000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(refresh_origin_guard_1.RefreshOriginGuard, throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60_000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, allow_during_password_change_decorator_1.AllowDuringPasswordChange)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, allow_during_password_change_decorator_1.AllowDuringPasswordChange)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, allow_during_password_change_decorator_1.AllowDuringPasswordChange)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map