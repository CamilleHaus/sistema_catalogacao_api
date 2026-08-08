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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
let ProjectsService = class ProjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(currentUser, query) {
        const empresaId = this.getCompanyId(currentUser);
        const search = query.busca?.trim();
        const projetos = await this.prisma.projeto.findMany({
            where: {
                empresaId,
                ...(search
                    ? { nome: { contains: search, mode: 'insensitive' } }
                    : {}),
                ...(currentUser.papel === client_1.PapelUsuario.USUARIO
                    ? {
                        status: client_1.StatusProjeto.ATIVO,
                        usuarios: { some: { usuarioId: currentUser.id } },
                    }
                    : query.status
                        ? { status: query.status }
                        : {}),
            },
            select: {
                id: true,
                empresaId: true,
                nome: true,
                status: true,
                cliente: { select: { id: true, nome: true, codigo: true } },
                criadoEm: true,
                atualizadoEm: true,
                ...(currentUser.papel === client_1.PapelUsuario.ADMIN_EMPRESA
                    ? { _count: { select: { usuarios: true } } }
                    : {}),
                usuarios: {
                    where: { usuarioId: currentUser.id },
                    select: { permissao: true },
                },
            },
            orderBy: { nome: 'asc' },
        });
        return projetos.map(({ usuarios, ...projeto }) => ({
            ...projeto,
            ...(currentUser.papel === client_1.PapelUsuario.USUARIO
                ? { permissao: usuarios[0]?.permissao }
                : {}),
        }));
    }
    async create(currentUser, dto) {
        const empresaId = this.getCompanyId(currentUser);
        const cliente = await this.prisma.cliente.findFirst({
            where: { id: dto.clienteId, empresaId },
            select: { id: true },
        });
        if (!cliente) {
            throw new common_1.BadRequestException('Cliente inválido ou pertencente a outra empresa.');
        }
        try {
            return await this.prisma.projeto.create({
                data: {
                    empresaId,
                    clienteId: cliente.id,
                    nome: dto.nome.trim(),
                },
                include: { cliente: true },
            });
        }
        catch (error) {
            this.handleUniqueConstraint(error);
            throw error;
        }
    }
    async findOne(currentUser, projetoId) {
        const projeto = await this.prisma.projeto.findFirst({
            where: this.accessWhere(currentUser, projetoId),
            select: {
                id: true,
                empresaId: true,
                nome: true,
                status: true,
                cliente: { select: { id: true, nome: true, codigo: true } },
                criadoEm: true,
                atualizadoEm: true,
                ...(currentUser.papel === client_1.PapelUsuario.ADMIN_EMPRESA
                    ? { _count: { select: { usuarios: true } } }
                    : {}),
                usuarios: {
                    where: { usuarioId: currentUser.id },
                    select: { permissao: true },
                },
            },
        });
        if (!projeto) {
            throw new common_1.NotFoundException('Projeto não encontrado.');
        }
        const { usuarios, ...dadosProjeto } = projeto;
        return {
            ...dadosProjeto,
            ...(currentUser.papel === client_1.PapelUsuario.USUARIO
                ? { permissao: usuarios[0]?.permissao }
                : {}),
        };
    }
    async update(currentUser, projetoId, dto) {
        const projeto = await this.requireCompanyProject(currentUser, projetoId);
        try {
            return await this.prisma.projeto.update({
                where: { id: projeto.id },
                data: { nome: dto.nome.trim() },
            });
        }
        catch (error) {
            this.handleUniqueConstraint(error);
            throw error;
        }
    }
    async archive(currentUser, projetoId) {
        const projeto = await this.requireCompanyProject(currentUser, projetoId);
        if (projeto.status === client_1.StatusProjeto.ARQUIVADO) {
            throw new common_1.BadRequestException('O projeto já está arquivado.');
        }
        return this.prisma.projeto.update({
            where: { id: projeto.id },
            data: { status: client_1.StatusProjeto.ARQUIVADO },
        });
    }
    async reactivationPreview(currentUser, projetoId) {
        const projeto = await this.requireCompanyProject(currentUser, projetoId);
        if (projeto.status !== client_1.StatusProjeto.ARQUIVADO) {
            throw new common_1.BadRequestException('O projeto não está arquivado.');
        }
        const vinculos = await this.prisma.usuarioProjeto.findMany({
            where: { projetoId },
            select: {
                permissao: true,
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        ativo: true,
                        papel: true,
                    },
                },
            },
            orderBy: { usuario: { nome: 'asc' } },
        });
        return {
            projeto,
            usuariosComVinculo: vinculos.map(({ usuario, permissao }) => ({
                ...usuario,
                permissao,
            })),
        };
    }
    async reactivate(currentUser, projetoId, dto) {
        const empresaId = this.getCompanyId(currentUser);
        const userAccesses = this.uniqueUserAccesses(dto.usuarios);
        const userIds = userAccesses.map(({ usuarioId }) => usuarioId);
        const confirmedDeactivationIds = new Set(this.uniqueIds(dto.confirmarDesativacaoUsuarioIds ?? []));
        return this.prisma.$transaction(async (transaction) => {
            const projeto = await this.requireCompanyProject(currentUser, projetoId, transaction);
            if (projeto.status !== client_1.StatusProjeto.ARQUIVADO) {
                throw new common_1.BadRequestException('O projeto não está arquivado.');
            }
            await this.validateActiveCommonUsers(transaction, empresaId, userIds);
            const currentLinks = await transaction.usuarioProjeto.findMany({
                where: { projetoId },
                select: { usuarioId: true },
            });
            const desiredSet = new Set(userIds);
            const removedUserIds = currentLinks
                .map(({ usuarioId }) => usuarioId)
                .filter((usuarioId) => !desiredSet.has(usuarioId));
            const otherLinks = removedUserIds.length === 0
                ? []
                : await transaction.usuarioProjeto.groupBy({
                    by: ['usuarioId'],
                    where: {
                        usuarioId: { in: removedUserIds },
                        projetoId: { not: projetoId },
                    },
                    _count: { _all: true },
                });
            const usersWithOtherLinks = new Set(otherLinks.map(({ usuarioId }) => usuarioId));
            const activeUsersLosingLastProject = await transaction.usuario.findMany({
                where: {
                    id: {
                        in: removedUserIds.filter((usuarioId) => !usersWithOtherLinks.has(usuarioId)),
                    },
                    ativo: true,
                    papel: client_1.PapelUsuario.USUARIO,
                },
                select: { id: true },
            });
            const usersToDeactivate = activeUsersLosingLastProject.map(({ id }) => id);
            const missingConfirmations = usersToDeactivate.filter((usuarioId) => !confirmedDeactivationIds.has(usuarioId));
            if (missingConfirmations.length > 0) {
                throw new common_1.ConflictException({
                    code: 'LAST_PROJECT_REMOVAL_REQUIRES_CONFIRMATION',
                    message: 'A remoção do último projeto exige confirmação da desativação dos usuários.',
                    details: { usuarioIds: missingConfirmations },
                });
            }
            await transaction.usuarioProjeto.deleteMany({ where: { projetoId } });
            for (const usuarioId of usersToDeactivate) {
                await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
                await transaction.sessao.updateMany({
                    where: { usuarioId, revogadoEm: null },
                    data: { revogadoEm: new Date() },
                });
                await transaction.usuario.update({
                    where: { id: usuarioId },
                    data: { ativo: false },
                });
            }
            if (userIds.length > 0) {
                await transaction.usuarioProjeto.createMany({
                    data: userAccesses.map((acesso) => ({ projetoId, ...acesso })),
                });
            }
            return transaction.projeto.update({
                where: { id: projetoId },
                data: { status: client_1.StatusProjeto.ATIVO },
            });
        });
    }
    async listUsers(currentUser, projetoId) {
        await this.requireCompanyProject(currentUser, projetoId);
        return this.prisma.usuarioProjeto.findMany({
            where: { projetoId },
            select: {
                criadoEm: true,
                permissao: true,
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        ativo: true,
                        papel: true,
                    },
                },
            },
            orderBy: { usuario: { nome: 'asc' } },
        });
    }
    async updateUsers(currentUser, projetoId, dto) {
        const empresaId = this.getCompanyId(currentUser);
        const desiredAccesses = this.uniqueUserAccesses(dto.usuarios);
        const desiredUserIds = desiredAccesses.map(({ usuarioId }) => usuarioId);
        const confirmedDeactivationIds = new Set(this.uniqueIds(dto.confirmarDesativacaoUsuarioIds ?? []));
        return this.prisma.$transaction(async (transaction) => {
            const projeto = await this.requireCompanyProject(currentUser, projetoId, transaction);
            if (projeto.status !== client_1.StatusProjeto.ATIVO) {
                throw new common_1.BadRequestException('Edite os vínculos durante a reativação do projeto arquivado.');
            }
            await this.validateActiveCommonUsers(transaction, empresaId, desiredUserIds);
            const currentLinks = await transaction.usuarioProjeto.findMany({
                where: { projetoId },
                select: { usuarioId: true },
            });
            const desiredSet = new Set(desiredUserIds);
            const currentSet = new Set(currentLinks.map(({ usuarioId }) => usuarioId));
            const removedUserIds = [...currentSet].filter((id) => !desiredSet.has(id));
            const otherLinks = removedUserIds.length === 0
                ? []
                : await transaction.usuarioProjeto.groupBy({
                    by: ['usuarioId'],
                    where: {
                        usuarioId: { in: removedUserIds },
                        projetoId: { not: projetoId },
                    },
                    _count: { _all: true },
                });
            const usersWithOtherLinks = new Set(otherLinks.map(({ usuarioId }) => usuarioId));
            const usersLosingLastProject = removedUserIds.filter((usuarioId) => !usersWithOtherLinks.has(usuarioId));
            const missingConfirmations = usersLosingLastProject.filter((usuarioId) => !confirmedDeactivationIds.has(usuarioId));
            if (missingConfirmations.length > 0) {
                throw new common_1.ConflictException({
                    code: 'LAST_PROJECT_REMOVAL_REQUIRES_CONFIRMATION',
                    message: 'A remoção do último projeto exige confirmação da desativação dos usuários.',
                    details: { usuarioIds: missingConfirmations },
                });
            }
            if (removedUserIds.length > 0) {
                await transaction.usuarioProjeto.deleteMany({
                    where: { projetoId, usuarioId: { in: removedUserIds } },
                });
            }
            for (const usuarioId of usersLosingLastProject) {
                await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
                await transaction.sessao.updateMany({
                    where: { usuarioId, revogadoEm: null },
                    data: { revogadoEm: new Date() },
                });
                await transaction.usuario.update({
                    where: { id: usuarioId },
                    data: { ativo: false },
                });
            }
            const addedUserIds = desiredUserIds.filter((id) => !currentSet.has(id));
            if (addedUserIds.length > 0) {
                await transaction.usuarioProjeto.createMany({
                    data: desiredAccesses
                        .filter(({ usuarioId }) => addedUserIds.includes(usuarioId))
                        .map((acesso) => ({ projetoId, ...acesso })),
                });
            }
            for (const { usuarioId, permissao } of desiredAccesses) {
                await transaction.usuarioProjeto.updateMany({
                    where: { projetoId, usuarioId },
                    data: { permissao },
                });
            }
            return transaction.usuarioProjeto.findMany({
                where: { projetoId },
                select: {
                    criadoEm: true,
                    permissao: true,
                    usuario: {
                        select: {
                            id: true,
                            nome: true,
                            email: true,
                            ativo: true,
                            papel: true,
                        },
                    },
                },
                orderBy: { usuario: { nome: 'asc' } },
            });
        });
    }
    accessWhere(currentUser, projetoId) {
        const empresaId = this.getCompanyId(currentUser);
        return {
            id: projetoId,
            empresaId,
            ...(currentUser.papel === client_1.PapelUsuario.USUARIO
                ? {
                    status: client_1.StatusProjeto.ATIVO,
                    usuarios: { some: { usuarioId: currentUser.id } },
                }
                : {}),
        };
    }
    async requireCompanyProject(currentUser, projetoId, client = this.prisma) {
        const projeto = await client.projeto.findFirst({
            where: {
                id: projetoId,
                empresaId: this.getCompanyId(currentUser),
            },
        });
        if (!projeto) {
            throw new common_1.NotFoundException('Projeto não encontrado.');
        }
        return projeto;
    }
    async validateActiveCommonUsers(client, empresaId, userIds) {
        if (userIds.length === 0)
            return;
        const count = await client.usuario.count({
            where: {
                id: { in: userIds },
                empresaId,
                papel: client_1.PapelUsuario.USUARIO,
                ativo: true,
            },
        });
        if (count !== userIds.length) {
            throw new common_1.BadRequestException('Um ou mais usuários são inválidos, inativos, administradores ou pertencem a outra empresa.');
        }
    }
    getCompanyId(user) {
        if (!user.empresaId) {
            throw new common_1.NotFoundException('Empresa não encontrada.');
        }
        return user.empresaId;
    }
    uniqueIds(ids) {
        return [...new Set(ids)];
    }
    uniqueUserAccesses(accesses) {
        return [
            ...new Map(accesses.map((access) => [access.usuarioId, access])).values(),
        ];
    }
    handleUniqueConstraint(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException('Já existe um projeto com esse nome para este cliente.');
        }
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map