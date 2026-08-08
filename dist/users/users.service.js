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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("../database/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(currentUser, query) {
        const empresaId = this.getCompanyId(currentUser);
        const search = query.busca?.trim();
        const where = {
            empresaId,
            ...(query.papel ? { papel: query.papel } : {}),
            ...(query.ativo === undefined ? {} : { ativo: query.ativo }),
            ...(search
                ? {
                    OR: [
                        { nome: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
        const skip = (query.pagina - 1) * query.limite;
        const [usuarios, total] = await this.prisma.$transaction([
            this.prisma.usuario.findMany({
                where,
                select: {
                    ...this.safeUserSelect,
                    _count: { select: { projetos: true } },
                },
                orderBy: { nome: 'asc' },
                skip,
                take: query.limite,
            }),
            this.prisma.usuario.count({ where }),
        ]);
        return {
            dados: usuarios,
            paginacao: {
                pagina: query.pagina,
                limite: query.limite,
                total,
                totalPaginas: Math.ceil(total / query.limite),
            },
        };
    }
    async create(currentUser, dto) {
        const empresaId = this.getCompanyId(currentUser);
        const projectAccesses = this.uniqueProjectAccesses(dto.projetos ?? []);
        const projectIds = projectAccesses.map(({ projetoId }) => projetoId);
        if (dto.papel === client_1.PapelUsuario.USUARIO && projectIds.length === 0) {
            throw new common_1.BadRequestException('Usuário comum deve possuir ao menos um projeto ativo.');
        }
        if (dto.papel === client_1.PapelUsuario.ADMIN_EMPRESA && projectIds.length > 0) {
            throw new common_1.BadRequestException('Administradores da empresa não utilizam vínculos com projetos.');
        }
        const passwordHash = await argon2.hash(dto.senhaTemporaria, {
            type: argon2.argon2id,
        });
        try {
            return await this.prisma.$transaction(async (transaction) => {
                if (dto.papel === client_1.PapelUsuario.USUARIO) {
                    await this.validateActiveProjects(transaction, empresaId, projectIds);
                }
                return transaction.usuario.create({
                    data: {
                        empresaId,
                        nome: dto.nome.trim(),
                        email: dto.email.trim().toLowerCase(),
                        senhaHash: passwordHash,
                        papel: dto.papel,
                        ativo: true,
                        deveAlterarSenha: true,
                        projetos: dto.papel === client_1.PapelUsuario.USUARIO
                            ? {
                                create: projectAccesses,
                            }
                            : undefined,
                    },
                    select: this.safeUserSelect,
                });
            });
        }
        catch (error) {
            this.handleUniqueConstraint(error);
            throw error;
        }
    }
    async findOne(currentUser, usuarioId) {
        const user = await this.prisma.usuario.findFirst({
            where: { id: usuarioId, empresaId: this.getCompanyId(currentUser) },
            select: {
                ...this.safeUserSelect,
                projetos: {
                    select: {
                        criadoEm: true,
                        permissao: true,
                        projeto: {
                            select: { id: true, nome: true, status: true },
                        },
                    },
                    orderBy: { projeto: { nome: 'asc' } },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado.');
        }
        return user;
    }
    async update(currentUser, usuarioId, dto) {
        const empresaId = this.getCompanyId(currentUser);
        if (dto.nome === undefined && dto.email === undefined) {
            throw new common_1.BadRequestException('Informe nome ou e-mail para atualização.');
        }
        await this.requireScopedUser(usuarioId, empresaId);
        try {
            return await this.prisma.usuario.update({
                where: { id: usuarioId },
                data: {
                    ...(dto.nome === undefined ? {} : { nome: dto.nome.trim() }),
                    ...(dto.email === undefined
                        ? {}
                        : { email: dto.email.trim().toLowerCase() }),
                },
                select: this.safeUserSelect,
            });
        }
        catch (error) {
            this.handleUniqueConstraint(error);
            throw error;
        }
    }
    async updateRole(currentUser, usuarioId, dto) {
        const empresaId = this.getCompanyId(currentUser);
        const projectAccesses = this.uniqueProjectAccesses(dto.projetos ?? []);
        const projectIds = projectAccesses.map(({ projetoId }) => projetoId);
        return this.prisma.$transaction(async (transaction) => {
            const target = await this.requireScopedUser(usuarioId, empresaId, transaction);
            if (target.papel === dto.papel) {
                throw new common_1.BadRequestException('O usuário já possui esse papel.');
            }
            if (dto.papel === client_1.PapelUsuario.ADMIN_EMPRESA) {
                if (target.papel !== client_1.PapelUsuario.USUARIO) {
                    throw new common_1.BadRequestException('Apenas usuários comuns podem ser promovidos.');
                }
                if (!target.ativo) {
                    throw new common_1.BadRequestException('O usuário deve estar ativo antes de ser promovido.');
                }
                if (projectIds.length > 0) {
                    throw new common_1.BadRequestException('Administradores da empresa não utilizam vínculos com projetos.');
                }
                await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
            }
            else {
                if (target.papel !== client_1.PapelUsuario.ADMIN_EMPRESA) {
                    throw new common_1.BadRequestException('Apenas administradores da empresa podem ser rebaixados.');
                }
                if (currentUser.id === usuarioId) {
                    throw new common_1.ForbiddenException('Você não pode rebaixar a si mesmo.');
                }
                if (!target.ativo) {
                    throw new common_1.BadRequestException('O administrador deve estar ativo antes de ser rebaixado.');
                }
                if (projectIds.length === 0) {
                    throw new common_1.BadRequestException('Selecione ao menos um projeto ativo para o usuário.');
                }
                await this.validateActiveProjects(transaction, empresaId, projectIds);
                await transaction.usuarioProjeto.createMany({
                    data: projectAccesses.map((acesso) => ({ usuarioId, ...acesso })),
                });
            }
            const updatedUser = await transaction.usuario.update({
                where: { id: usuarioId },
                data: { papel: dto.papel },
                select: this.safeUserSelect,
            });
            await this.revokeSessions(transaction, usuarioId);
            return updatedUser;
        });
    }
    async deactivate(currentUser, usuarioId) {
        const empresaId = this.getCompanyId(currentUser);
        return this.prisma.$transaction(async (transaction) => {
            const target = await this.requireScopedUser(usuarioId, empresaId, transaction);
            if (target.papel !== client_1.PapelUsuario.USUARIO) {
                throw new common_1.ForbiddenException('Administradores da empresa só podem ser desativados pelo administrador global.');
            }
            await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
            await this.revokeSessions(transaction, usuarioId);
            return transaction.usuario.update({
                where: { id: usuarioId },
                data: { ativo: false },
                select: this.safeUserSelect,
            });
        });
    }
    async reactivate(currentUser, usuarioId, rawProjectAccesses) {
        const empresaId = this.getCompanyId(currentUser);
        const projectAccesses = this.uniqueProjectAccesses(rawProjectAccesses);
        const projectIds = projectAccesses.map(({ projetoId }) => projetoId);
        return this.prisma.$transaction(async (transaction) => {
            const target = await this.requireScopedUser(usuarioId, empresaId, transaction);
            if (target.papel !== client_1.PapelUsuario.USUARIO) {
                throw new common_1.ForbiddenException('Administradores da empresa só podem ser reativados pelo administrador global.');
            }
            if (target.ativo) {
                throw new common_1.BadRequestException('O usuário já está ativo.');
            }
            await this.validateActiveProjects(transaction, empresaId, projectIds);
            await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
            await transaction.usuarioProjeto.createMany({
                data: projectAccesses.map((acesso) => ({ usuarioId, ...acesso })),
            });
            return transaction.usuario.update({
                where: { id: usuarioId },
                data: { ativo: true },
                select: this.safeUserSelect,
            });
        });
    }
    async updateProjects(currentUser, usuarioId, dto) {
        const empresaId = this.getCompanyId(currentUser);
        const projectAccesses = this.uniqueProjectAccesses(dto.projetos);
        const projectIds = projectAccesses.map(({ projetoId }) => projetoId);
        return this.prisma.$transaction(async (transaction) => {
            const target = await this.requireScopedUser(usuarioId, empresaId, transaction);
            if (target.papel !== client_1.PapelUsuario.USUARIO || !target.ativo) {
                throw new common_1.BadRequestException('Os vínculos só podem ser alterados para usuários comuns ativos.');
            }
            if (projectIds.length === 0) {
                if (!dto.confirmarDesativacao) {
                    throw new common_1.ConflictException('A remoção do último projeto exige confirmação da desativação.');
                }
                await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
                await this.revokeSessions(transaction, usuarioId);
                return transaction.usuario.update({
                    where: { id: usuarioId },
                    data: { ativo: false },
                    select: this.safeUserSelect,
                });
            }
            await this.validateActiveProjects(transaction, empresaId, projectIds);
            await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
            await transaction.usuarioProjeto.createMany({
                data: projectAccesses.map((acesso) => ({ usuarioId, ...acesso })),
            });
            return transaction.usuario.findUniqueOrThrow({
                where: { id: usuarioId },
                select: this.safeUserSelect,
            });
        });
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
    getCompanyId(user) {
        if (!user.empresaId) {
            throw new common_1.NotFoundException('Empresa não encontrada.');
        }
        return user.empresaId;
    }
    async requireScopedUser(usuarioId, empresaId, client = this.prisma) {
        const user = await client.usuario.findFirst({
            where: { id: usuarioId, empresaId },
            select: { id: true, papel: true, ativo: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado.');
        }
        return user;
    }
    async validateActiveProjects(client, empresaId, projectIds) {
        if (projectIds.length === 0) {
            throw new common_1.BadRequestException('Selecione ao menos um projeto ativo.');
        }
        const count = await client.projeto.count({
            where: {
                id: { in: projectIds },
                empresaId,
                status: client_1.StatusProjeto.ATIVO,
            },
        });
        if (count !== projectIds.length) {
            throw new common_1.BadRequestException('Um ou mais projetos são inválidos, arquivados ou pertencem a outra empresa.');
        }
    }
    revokeSessions(client, usuarioId) {
        return client.sessao.updateMany({
            where: { usuarioId, revogadoEm: null },
            data: { revogadoEm: new Date() },
        });
    }
    uniqueIds(ids) {
        return [...new Set(ids)];
    }
    uniqueProjectAccesses(accesses) {
        return [
            ...new Map(accesses.map((access) => [access.projetoId, access])).values(),
        ];
    }
    handleUniqueConstraint(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException('E-mail já cadastrado.');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map