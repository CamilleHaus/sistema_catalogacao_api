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
exports.WorksService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
const measurements_1 = require("../common/utils/measurements");
const catalog_1 = require("../common/utils/catalog");
let WorksService = class WorksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(projetoId, query) {
        const busca = query.busca?.trim();
        const works = await this.prisma.obra.findMany({
            where: {
                projetoId,
                ...(busca
                    ? {
                        OR: [
                            { codigoAcervo: { contains: busca, mode: 'insensitive' } },
                            { numeroManual: { contains: busca, mode: 'insensitive' } },
                            { titulo: { contains: busca, mode: 'insensitive' } },
                            {
                                artistas: {
                                    some: {
                                        artista: {
                                            nome: { contains: busca, mode: 'insensitive' },
                                        },
                                    },
                                },
                            },
                        ],
                    }
                    : {}),
            },
            include: this.relations,
            orderBy: { codigoAcervo: 'asc' },
        });
        return works.map((work) => this.present(work));
    }
    async findOne(projetoId, obraId) {
        const work = await this.prisma.obra.findFirst({
            where: { id: obraId, projetoId },
            include: this.relations,
        });
        if (!work)
            throw new common_1.NotFoundException('Obra não encontrada.');
        return this.present(work);
    }
    async create(projetoId, dto) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const context = await this.projectContext(tx, projetoId);
                const artistaIds = this.unique(dto.artistaIds ?? []);
                await this.validateRelations(tx, context, {
                    artistaIds,
                    statusId: dto.statusId,
                    tecnicaId: dto.tecnicaId,
                    localizacaoId: dto.localizacaoId,
                    fichaMaeId: dto.fichaMaeId,
                });
                const numeroManual = dto.numeroManual.trim();
                const work = await tx.obra.create({
                    data: {
                        projetoId,
                        numeroManual,
                        codigoAcervo: (0, catalog_1.buildCollectionCode)(numeroManual, context.cliente.codigo),
                        titulo: this.text(dto.titulo),
                        edicao: this.text(dto.edicao),
                        data: this.text(dto.data),
                        ...this.partes(dto.quantidadePartes),
                        ...this.serie(dto.tituloSerie),
                        fichaMaeId: dto.fichaMaeId ?? null,
                        statusId: dto.statusId ?? null,
                        tecnicaId: dto.tecnicaId ?? null,
                        localizacaoId: dto.localizacaoId ?? null,
                        artistas: artistaIds.length
                            ? { create: artistaIds.map((artistaId) => ({ artistaId })) }
                            : undefined,
                    },
                    include: this.relations,
                });
                return this.present(work);
            });
        }
        catch (error) {
            this.handleUnique(error);
            throw error;
        }
    }
    async update(projetoId, obraId, dto) {
        if (Object.values(dto).every((value) => value === undefined)) {
            throw new common_1.BadRequestException('Informe ao menos um campo para atualização.');
        }
        try {
            return await this.prisma.$transaction(async (tx) => {
                const context = await this.projectContext(tx, projetoId);
                const existing = await tx.obra.findFirst({
                    where: { id: obraId, projetoId },
                    select: { id: true },
                });
                if (!existing)
                    throw new common_1.NotFoundException('Obra não encontrada.');
                const artistaIds = dto.artistaIds === undefined
                    ? undefined
                    : this.unique(dto.artistaIds);
                await this.validateRelations(tx, context, {
                    artistaIds,
                    statusId: dto.statusId,
                    tecnicaId: dto.tecnicaId,
                    localizacaoId: dto.localizacaoId,
                    fichaMaeId: dto.fichaMaeId,
                });
                if (artistaIds !== undefined) {
                    await tx.obraArtista.deleteMany({ where: { obraId } });
                    if (artistaIds.length)
                        await tx.obraArtista.createMany({
                            data: artistaIds.map((artistaId) => ({ obraId, artistaId })),
                        });
                }
                const numeroManual = dto.numeroManual?.trim();
                const work = await tx.obra.update({
                    where: { id: obraId },
                    data: {
                        ...(numeroManual === undefined
                            ? {}
                            : {
                                numeroManual,
                                codigoAcervo: (0, catalog_1.buildCollectionCode)(numeroManual, context.cliente.codigo),
                            }),
                        ...(dto.titulo === undefined
                            ? {}
                            : { titulo: this.text(dto.titulo) }),
                        ...(dto.edicao === undefined
                            ? {}
                            : { edicao: this.text(dto.edicao) }),
                        ...(dto.data === undefined ? {} : { data: this.text(dto.data) }),
                        ...(dto.quantidadePartes === undefined
                            ? {}
                            : this.partes(dto.quantidadePartes)),
                        ...(dto.tituloSerie === undefined
                            ? {}
                            : this.serie(dto.tituloSerie)),
                        ...(dto.fichaMaeId === undefined
                            ? {}
                            : { fichaMaeId: dto.fichaMaeId }),
                        ...(dto.statusId === undefined ? {} : { statusId: dto.statusId }),
                        ...(dto.tecnicaId === undefined
                            ? {}
                            : { tecnicaId: dto.tecnicaId }),
                        ...(dto.localizacaoId === undefined
                            ? {}
                            : { localizacaoId: dto.localizacaoId }),
                    },
                    include: this.relations,
                });
                return this.present(work);
            });
        }
        catch (error) {
            this.handleUnique(error);
            throw error;
        }
    }
    async projectContext(tx, projetoId) {
        const project = await tx.projeto.findUnique({
            where: { id: projetoId },
            select: {
                id: true,
                empresaId: true,
                cliente: { select: { codigo: true } },
            },
        });
        if (!project)
            throw new common_1.NotFoundException('Projeto não encontrado.');
        return project;
    }
    async validateRelations(tx, context, refs) {
        const checks = [];
        if (refs.artistaIds !== undefined && refs.artistaIds.length)
            checks.push(tx.artista
                .count({
                where: {
                    id: { in: refs.artistaIds },
                    empresaId: context.empresaId,
                },
            })
                .then((count) => {
                if (count !== refs.artistaIds?.length)
                    throw new common_1.BadRequestException('Um ou mais artistas não pertencem à empresa do projeto.');
            }));
        if (refs.statusId)
            checks.push(tx.statusObra
                .findFirst({
                where: { id: refs.statusId, empresaId: context.empresaId },
                select: { id: true },
            })
                .then((item) => {
                if (!item)
                    throw new common_1.BadRequestException('Status inválido para a empresa do projeto.');
            }));
        if (refs.tecnicaId)
            checks.push(tx.tecnica
                .findFirst({
                where: {
                    id: refs.tecnicaId,
                    empresaId: context.empresaId,
                    OR: [{ projetoId: null }, { projetoId: context.id }],
                },
                select: { id: true },
            })
                .then((item) => {
                if (!item)
                    throw new common_1.BadRequestException('Técnica inválida para este projeto.');
            }));
        if (refs.localizacaoId)
            checks.push(tx.localizacao
                .findFirst({
                where: { id: refs.localizacaoId, projetoId: context.id },
                select: { id: true },
            })
                .then((item) => {
                if (!item)
                    throw new common_1.BadRequestException('Localização inválida para este projeto.');
            }));
        if (refs.fichaMaeId)
            checks.push(tx.fichaMae
                .findFirst({
                where: { id: refs.fichaMaeId, projetoId: context.id },
                select: { id: true },
            })
                .then((item) => {
                if (!item)
                    throw new common_1.BadRequestException('Ficha mãe inválida para este projeto.');
            }));
        await Promise.all(checks);
    }
    relations = {
        imagemPrincipal: { select: { id: true, imagemUrl: true, creditos: true } },
        status: { select: { id: true, nome: true } },
        tecnica: { select: { id: true, nome: true, projetoId: true } },
        localizacao: { select: { id: true, nome: true, paiId: true } },
        artistas: {
            select: { artista: true },
            orderBy: { artista: { nome: 'asc' } },
        },
        dimensoes: { orderBy: { tipo: 'asc' } },
        fichaMae: { select: { id: true, codigo: true, descricao: true } },
    };
    present(work) {
        const { artistas, dimensoes, ...data } = work;
        const result = {
            ...data,
            tituloExibicao: work.titulo?.trim() || 'Sem título',
            artistas: artistas.map(({ artista }) => artista),
            dimensoes: dimensoes.map((dimension) => (0, measurements_1.presentDimension)(dimension)),
        };
        const media = data;
        return {
            ...result,
            fotoPrincipalUrl: media.imagemPrincipal?.imagemUrl ?? media.fotoPrincipalUrl ?? null,
            fotoPrincipalCreditos: media.imagemPrincipal?.creditos ?? null,
        };
    }
    partes(quantidadePartes) {
        return {
            grupoObra: quantidadePartes != null,
            quantidadePartes: quantidadePartes ?? null,
        };
    }
    serie(tituloSerie) {
        const titulo = this.text(tituloSerie);
        return { serie: titulo !== null, tituloSerie: titulo };
    }
    text(value) {
        const normalized = value?.trim();
        return normalized || null;
    }
    unique(ids) {
        return [...new Set(ids)];
    }
    handleUnique(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002')
            throw new common_1.ConflictException('Já existe uma obra com esse código de acervo no projeto.');
    }
};
exports.WorksService = WorksService;
exports.WorksService = WorksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorksService);
//# sourceMappingURL=works.service.js.map