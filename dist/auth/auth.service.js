"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../database/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    dummyPasswordHash = '';
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async onModuleInit() {
        this.dummyPasswordHash = await argon2.hash((0, node_crypto_1.randomBytes)(32).toString('base64url'), { type: argon2.argon2id });
    }
    async login(dto, context) {
        const user = await this.prisma.usuario.findUnique({
            where: { email: dto.email.trim().toLowerCase() },
        });
        const passwordMatches = await argon2.verify(user?.senhaHash ?? this.dummyPasswordHash, dto.senha);
        if (!user || !user.ativo || !passwordMatches) {
            throw new common_1.UnauthorizedException('E-mail ou senha inválidos.');
        }
        const sessionId = (0, node_crypto_1.randomUUID)();
        const refreshSecret = this.createRefreshSecret();
        const refreshToken = `${sessionId}.${refreshSecret}`;
        const sessionTtlDays = this.configService.get('auth.sessionTtlDays', {
            infer: true,
        });
        await this.prisma.sessao.create({
            data: {
                id: sessionId,
                usuarioId: user.id,
                refreshTokenHash: await argon2.hash(refreshSecret, {
                    type: argon2.argon2id,
                }),
                userAgent: context.userAgent,
                ipHash: context.ip ? await this.hashIp(context.ip) : undefined,
                expiraEm: new Date(Date.now() + sessionTtlDays * 86_400_000),
            },
        });
        return {
            accessToken: await this.createAccessToken(user.id, sessionId),
            refreshToken,
            usuario: this.toAuthenticatedUser(user, sessionId),
        };
    }
    async refresh(rawRefreshToken) {
        const parsedToken = this.parseRefreshToken(rawRefreshToken);
        const session = await this.prisma.sessao.findUnique({
            where: { id: parsedToken.sessionId },
            include: { usuario: true },
        });
        if (!session ||
            session.revogadoEm ||
            session.expiraEm <= new Date() ||
            !session.usuario.ativo) {
            throw new common_1.UnauthorizedException('Sessão inválida ou expirada.');
        }
        const refreshTokenMatches = await argon2.verify(session.refreshTokenHash, parsedToken.secret);
        if (!refreshTokenMatches) {
            await this.prisma.sessao.update({
                where: { id: session.id },
                data: { revogadoEm: new Date() },
            });
            throw new common_1.UnauthorizedException('Sessão inválida ou expirada.');
        }
        const nextSecret = this.createRefreshSecret();
        await this.prisma.sessao.update({
            where: { id: session.id },
            data: {
                refreshTokenHash: await argon2.hash(nextSecret, {
                    type: argon2.argon2id,
                }),
            },
        });
        return {
            accessToken: await this.createAccessToken(session.usuario.id, session.id),
            refreshToken: `${session.id}.${nextSecret}`,
            usuario: this.toAuthenticatedUser(session.usuario, session.id),
        };
    }
    async logout(user) {
        await this.prisma.sessao.updateMany({
            where: {
                id: user.sessaoId,
                usuarioId: user.id,
                revogadoEm: null,
            },
            data: { revogadoEm: new Date() },
        });
    }
    async changeRequiredPassword(user, newPassword) {
        if (!user.deveAlterarSenha) {
            throw new common_1.ForbiddenException('A troca obrigatória de senha não está pendente.');
        }
        const updatedUser = await this.prisma.usuario.update({
            where: { id: user.id },
            data: {
                senhaHash: await argon2.hash(newPassword, { type: argon2.argon2id }),
                deveAlterarSenha: false,
            },
        });
        return this.toAuthenticatedUser(updatedUser, user.sessaoId);
    }
    async authenticateAccessToken(token) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('auth.jwtSecret', { infer: true }),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Token inválido ou expirado.');
        }
        if (!payload.sub || !payload.sid) {
            throw new common_1.UnauthorizedException('Token inválido ou expirado.');
        }
        const session = await this.prisma.sessao.findFirst({
            where: {
                id: payload.sid,
                usuarioId: payload.sub,
                revogadoEm: null,
                expiraEm: { gt: new Date() },
                usuario: { ativo: true },
            },
            include: { usuario: true },
        });
        if (!session) {
            throw new common_1.UnauthorizedException('Sessão inválida ou expirada.');
        }
        return this.toAuthenticatedUser(session.usuario, session.id);
    }
    async createAccessToken(userId, sessionId) {
        return this.jwtService.signAsync({ sub: userId, sid: sessionId }, {
            secret: this.configService.get('auth.jwtSecret', { infer: true }),
            expiresIn: this.configService.get('auth.accessTokenTtlSeconds', {
                infer: true,
            }),
        });
    }
    createRefreshSecret() {
        return (0, node_crypto_1.randomBytes)(32).toString('base64url');
    }
    parseRefreshToken(rawRefreshToken) {
        const [sessionId, secret, extra] = rawRefreshToken?.split('.') ?? [];
        if (!sessionId || !secret || extra) {
            throw new common_1.UnauthorizedException('Sessão inválida ou expirada.');
        }
        return { sessionId, secret };
    }
    async hashIp(ip) {
        return argon2.hash(ip, { type: argon2.argon2id });
    }
    toAuthenticatedUser(user, sessionId) {
        return {
            id: user.id,
            empresaId: user.empresaId,
            nome: user.nome,
            email: user.email,
            papel: user.papel,
            ativo: user.ativo,
            deveAlterarSenha: user.deveAlterarSenha,
            sessaoId: sessionId,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map