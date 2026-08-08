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
exports.AdminGlobalService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const cpf_1 = require("../common/utils/cpf");
const prisma_service_1 = require("../database/prisma.service");
let AdminGlobalService = class AdminGlobalService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async createCompany(dto) {
        const email = dto.administrador.email.trim().toLowerCase();
        const cpf = (0, cpf_1.normalizeCpf)(dto.administrador.cpf);
        if (!(0, cpf_1.isValidCpf)(cpf)) {
            throw new common_1.BadRequestException('CPF inválido.');
        }
        const passwordHash = await argon2.hash(dto.administrador.senhaTemporaria, {
            type: argon2.argon2id,
        });
        try {
            return await this.prisma.$transaction(async (transaction) => {
                const empresa = await transaction.empresa.create({
                    data: { nome: dto.empresa.nome.trim() },
                });
                const primeiroAdmin = await transaction.usuario.create({
                    data: {
                        empresaId: empresa.id,
                        nome: dto.administrador.nome.trim(),
                        email,
                        cpf,
                        senhaHash: passwordHash,
                        papel: client_1.PapelUsuario.ADMIN_EMPRESA,
                        ativo: true,
                        deveAlterarSenha: true,
                    },
                    select: this.safeUserSelect,
                });
                return {
                    empresa,
                    primeiroAdmin: {
                        ...primeiroAdmin,
                        cpfMascarado: (0, cpf_1.maskCpf)(cpf),
                    },
                };
            });
        }
        catch (error) {
            this.handleUniqueConstraint(error);
            throw error;
        }
    }
    listCompanies() {
        return this.prisma.empresa.findMany({
            orderBy: { nome: 'asc' },
            include: {
                _count: { select: { usuarios: true, projetos: true } },
            },
        });
    }
    async listUsers(query) {
        const search = query.busca?.trim();
        const where = search
            ? {
                OR: [
                    { nome: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { empresa: { nome: { contains: search, mode: 'insensitive' } } },
                ],
            }
            : {};
        const skip = (query.pagina - 1) * query.limite;
        const [usuarios, total] = await this.prisma.$transaction([
            this.prisma.usuario.findMany({
                where,
                select: {
                    ...this.safeUserSelect,
                    cpf: true,
                    empresa: { select: { id: true, nome: true } },
                },
                orderBy: { nome: 'asc' },
                skip,
                take: query.limite,
            }),
            this.prisma.usuario.count({ where }),
        ]);
        return {
            dados: usuarios.map(({ cpf, ...usuario }) => ({
                ...usuario,
                cpfMascarado: (0, cpf_1.maskCpf)(cpf),
            })),
            paginacao: {
                pagina: query.pagina,
                limite: query.limite,
                total,
                totalPaginas: Math.ceil(total / query.limite),
            },
        };
    }
    async resetPassword(usuarioId) {
        const user = await this.prisma.usuario.findUnique({
            where: { id: usuarioId },
            select: { id: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado.');
        }
        const passwordHash = await argon2.hash(this.configService.get('auth.resetPassword', { infer: true }), { type: argon2.argon2id });
        await this.prisma.$transaction([
            this.prisma.usuario.update({
                where: { id: usuarioId },
                data: { senhaHash: passwordHash, deveAlterarSenha: true },
            }),
            this.prisma.sessao.updateMany({
                where: { usuarioId, revogadoEm: null },
                data: { revogadoEm: new Date() },
            }),
        ]);
        return { message: 'Senha redefinida e sessões revogadas.' };
    }
    async updateCompanyAdminStatus(usuarioId, ativo) {
        const admin = await this.prisma.usuario.findFirst({
            where: { id: usuarioId, papel: client_1.PapelUsuario.ADMIN_EMPRESA },
            select: { id: true },
        });
        if (!admin) {
            throw new common_1.NotFoundException('Administrador da empresa não encontrado.');
        }
        await this.prisma.$transaction(async (transaction) => {
            await transaction.usuario.update({
                where: { id: usuarioId },
                data: { ativo },
            });
            if (!ativo) {
                await transaction.sessao.updateMany({
                    where: { usuarioId, revogadoEm: null },
                    data: { revogadoEm: new Date() },
                });
            }
        });
        return { id: usuarioId, ativo };
    }
    safeUserSelect = {
        id: true,
        empresaId: true,
        nome: true,
        email: true,
        papel: true,
        ativo: true,
        deveAlterarSenha: true,
        criadoEm: true,
        atualizadoEm: true,
    };
    handleUniqueConstraint(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException('Empresa, e-mail ou CPF já cadastrado.');
        }
    }
};
exports.AdminGlobalService = AdminGlobalService;
exports.AdminGlobalService = AdminGlobalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AdminGlobalService);
//# sourceMappingURL=admin-global.service.js.map