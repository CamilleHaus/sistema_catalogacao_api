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
exports.WorkSetsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const authorization_service_1 = require("../auth/authorization.service");
const dimensions_1 = require("../common/utils/dimensions");
const measurements_1 = require("../common/utils/measurements");
const prisma_service_1 = require("../database/prisma.service");
const NO_DIMENSION = {
    altura: null,
    largura: null,
    profundidade: null,
    unidade: null,
    descricaoVariavel: null,
};
let WorkSetsService = class WorkSetsService {
    prisma;
    authorization;
    constructor(prisma, authorization) {
        this.prisma = prisma;
        this.authorization = authorization;
    }
    async list(user, query) {
        if (query.projetoId)
            await this.authorization.assertProjectAccess(user, query.projetoId);
        const items = await this.prisma.fichaMae.findMany({
            where: query.projetoId
                ? { projetoId: query.projetoId }
                : { projeto: this.visibleProjects(user) },
            include: this.relations,
            orderBy: [{ projeto: { nome: 'asc' } }, { codigo: 'asc' }],
        });
        return items.map((item) => this.present(item));
    }
    async findOne(user, id) {
        const item = await this.prisma.fichaMae.findFirst({
            where: { id, projeto: this.visibleProjects(user) },
            include: {
                ...this.relations,
                obras: {
                    select: {
                        id: true,
                        projetoId: true,
                        codigoAcervo: true,
                        titulo: true,
                    },
                    orderBy: { codigoAcervo: 'asc' },
                },
            },
        });
        if (!item)
            throw new common_1.NotFoundException('Ficha mãe não encontrada.');
        return { ...this.present(item), obras: item.obras };
    }
    async create(user, dto) {
        await this.authorization.assertProjectAccess(user, dto.projetoId, client_1.PermissaoProjeto.EDITAR);
        try {
            const item = await this.prisma.fichaMae.create({
                data: { projetoId: dto.projetoId, ...this.fields(dto) },
                include: this.relations,
            });
            return this.present(item);
        }
        catch (error) {
            this.unique(error);
            throw error;
        }
    }
    async update(user, id, dto) {
        const current = await this.prisma.fichaMae.findFirst({
            where: { id, projeto: this.visibleProjects(user) },
            select: { projetoId: true, _count: { select: { obras: true } } },
        });
        if (!current)
            throw new common_1.NotFoundException('Ficha mãe não encontrada.');
        await this.authorization.assertProjectAccess(user, current.projetoId, client_1.PermissaoProjeto.EDITAR);
        if (dto.projetoId !== current.projetoId) {
            if (current._count.obras)
                throw new common_1.BadRequestException('Não é possível trocar o projeto de uma ficha mãe com obras vinculadas.');
            await this.authorization.assertProjectAccess(user, dto.projetoId, client_1.PermissaoProjeto.EDITAR);
        }
        try {
            const item = await this.prisma.fichaMae.update({
                where: { id },
                data: { projetoId: dto.projetoId, ...this.fields(dto) },
                include: this.relations,
            });
            return this.present(item);
        }
        catch (error) {
            this.unique(error);
            throw error;
        }
    }
    fields(dto) {
        const hasDimension = dto.altura !== undefined ||
            dto.largura !== undefined ||
            dto.profundidade !== undefined ||
            dto.unidade !== undefined ||
            Boolean(dto.descricaoVariavel?.trim());
        const codigo = dto.codigo.trim();
        const descricao = dto.descricao.trim();
        if (!codigo || !descricao)
            throw new common_1.BadRequestException('Código e descrição são obrigatórios.');
        return {
            codigo,
            descricao,
            imagemUrl: dto.imagemUrl?.trim() || null,
            ...(hasDimension ? (0, dimensions_1.validateDimensionInput)(dto) : NO_DIMENSION),
        };
    }
    unique(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002')
            throw new common_1.ConflictException('Já existe uma ficha mãe com esse código neste projeto.');
    }
    visibleProjects(user) {
        if (!user.empresaId || user.papel === client_1.PapelUsuario.ADMIN_GLOBAL)
            throw new common_1.NotFoundException('Empresa não encontrada.');
        return {
            empresaId: user.empresaId,
            ...(user.papel === client_1.PapelUsuario.USUARIO
                ? {
                    status: client_1.StatusProjeto.ATIVO,
                    usuarios: { some: { usuarioId: user.id } },
                }
                : {}),
        };
    }
    relations = {
        projeto: { select: { id: true, nome: true } },
        _count: { select: { obras: true } },
    };
    present(item) {
        const { altura, largura, profundidade, unidade, descricaoVariavel, _count, ...rest } = item;
        const dimension = {
            altura,
            largura,
            profundidade,
            unidade,
            descricaoVariavel,
        };
        return {
            ...rest,
            dimensao: unidade || descricaoVariavel ? (0, measurements_1.presentDimension)(dimension) : null,
            totalObras: _count.obras,
        };
    }
};
exports.WorkSetsService = WorkSetsService;
exports.WorkSetsService = WorkSetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        authorization_service_1.AuthorizationService])
], WorkSetsService);
//# sourceMappingURL=work-sets.service.js.map