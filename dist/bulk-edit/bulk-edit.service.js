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
exports.BulkEditService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const advanced_search_service_1 = require("../advanced-search/advanced-search.service");
const prisma_service_1 = require("../database/prisma.service");
const bulk_fields_1 = require("./bulk-fields");
let BulkEditService = class BulkEditService {
    prisma;
    search;
    constructor(prisma, search) {
        this.prisma = prisma;
        this.search = search;
    }
    async fields(projetoId) {
        const options = await this.search.optionSources(projetoId);
        return bulk_fields_1.BULK_FIELDS.map((field) => ({
            id: field.id,
            label: field.label,
            grupo: field.group,
            tipo: field.kind,
            ...(field.source || field.enumOptions
                ? { opcoes: field.source ? options[field.source] : field.enumOptions }
                : {}),
        }));
    }
    async apply(projetoId, dto) {
        const field = bulk_fields_1.BULK_FIELDS_BY_ID.get(dto.campo);
        if (!field)
            throw new common_1.BadRequestException('Campo inválido para edição em massa.');
        const value = await this.validate(projetoId, field, dto);
        const obraIds = [...new Set(dto.obraIds)];
        return this.prisma.$transaction(async (tx) => {
            const found = await tx.obra.count({
                where: { id: { in: obraIds }, projetoId },
            });
            if (found !== obraIds.length)
                throw new common_1.BadRequestException('Uma ou mais obras não pertencem a este projeto.');
            if (field.kind === 'lista')
                return this.applyList(tx, field, obraIds, value, dto.modo);
            if (field.target === 'obra')
                return this.applyWork(tx, projetoId, field, obraIds, value, dto);
            if (field.target === 'catalogacao')
                return this.applyCatalog(tx, field, obraIds, value);
            return this.applyTransaction(tx, field, obraIds, value);
        }, {
            isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable,
            timeout: 30_000,
        });
    }
    async validate(projetoId, field, dto) {
        const raw = dto.valor;
        if (field.kind === 'lista') {
            if (!dto.modo)
                throw new common_1.BadRequestException('Escolha se vai adicionar, remover ou substituir.');
            if (!Array.isArray(raw) || !raw.every((item) => typeof item === 'string'))
                throw new common_1.BadRequestException(`Escolha os itens de "${field.label}".`);
            if (raw.length === 0 && dto.modo !== 'substituir')
                throw new common_1.BadRequestException(`Escolha ao menos um item de "${field.label}".`);
            await this.assertOptions(projetoId, field, raw);
            return raw;
        }
        if (raw === null || raw === undefined || raw === '')
            return null;
        if (field.kind === 'texto') {
            if (typeof raw !== 'string')
                throw new common_1.BadRequestException(`Texto inválido em "${field.label}".`);
            const text = raw.trim();
            if (text.length > 500)
                throw new common_1.BadRequestException(`Texto longo demais em "${field.label}".`);
            return text || null;
        }
        if (field.kind === 'inteiro') {
            const number = typeof raw === 'number' ? raw : Number(raw);
            if (!Number.isInteger(number) || number < 2 || number > 9999)
                throw new common_1.BadRequestException(`"${field.label}" deve ser um número inteiro entre 2 e 9999.`);
            return number;
        }
        if (typeof raw !== 'string')
            throw new common_1.BadRequestException(`Opção inválida em "${field.label}".`);
        await this.assertOptions(projetoId, field, [raw]);
        return raw;
    }
    async assertOptions(projetoId, field, values) {
        const allowed = field.source
            ? (await this.search.optionSources(projetoId))[field.source]
            : (field.enumOptions ?? []);
        const ids = new Set(allowed.map((option) => option.value));
        if (!values.every((value) => ids.has(value)))
            throw new common_1.BadRequestException(`Opção inválida em "${field.label}" para este projeto.`);
    }
    async applyWork(tx, projetoId, field, obraIds, value, dto) {
        const data = field.id === 'quantidadePartes'
            ? {
                grupoObra: value !== null,
                quantidadePartes: value,
            }
            : field.id === 'tituloSerie'
                ? { serie: value !== null, tituloSerie: value }
                : { [field.column]: value };
        let movimentacoes = 0;
        if (field.id === 'localizacao' && dto.movimentacao?.registrar) {
            const moving = (await tx.obra.findMany({
                where: { id: { in: obraIds } },
                select: { id: true, localizacaoId: true },
            })).filter((work) => work.localizacaoId !== value);
            if (moving.length > 0) {
                const path = await this.locationPaths(tx, projetoId);
                const text = (raw) => raw?.trim() || null;
                const movement = dto.movimentacao;
                movimentacoes = (await tx.movimentacaoObra.createMany({
                    data: moving.map((work) => ({
                        obraId: work.id,
                        data: text(movement.data),
                        realizadoPor: text(movement.realizadoPor),
                        observacoes: text(movement.observacoes),
                        localSaidaId: work.localizacaoId,
                        localSaidaSnapshot: path(work.localizacaoId),
                        localEntradaId: value,
                        localEntradaSnapshot: path(value),
                    })),
                })).count;
            }
        }
        const { count } = await tx.obra.updateMany({
            where: { id: { in: obraIds } },
            data,
        });
        return { atualizadas: count, ignoradas: 0, movimentacoes };
    }
    async applyCatalog(tx, field, obraIds, value) {
        if (value !== null)
            await this.ensureCatalogs(tx, obraIds);
        const { count } = await tx.catalogacao.updateMany({
            where: { obraId: { in: obraIds } },
            data: { [field.column]: value },
        });
        return {
            atualizadas: value === null ? obraIds.length : count,
            ignoradas: 0,
            movimentacoes: 0,
        };
    }
    async applyTransaction(tx, field, obraIds, value) {
        const where = { obraId: { in: obraIds } };
        const data = { [field.column]: value };
        const { count } = field.target === 'aquisicao'
            ? await tx.aquisicao.updateMany({ where, data })
            : await tx.venda.updateMany({ where, data });
        return {
            atualizadas: count,
            ignoradas: obraIds.length - count,
            movimentacoes: 0,
        };
    }
    async applyList(tx, field, obraIds, ids, modo) {
        const result = {
            atualizadas: obraIds.length,
            ignoradas: 0,
            movimentacoes: 0,
        };
        if (field.id === 'artistas') {
            if (modo !== 'adicionar')
                await tx.obraArtista.deleteMany({
                    where: {
                        obraId: { in: obraIds },
                        ...(modo === 'remover' ? { artistaId: { in: ids } } : {}),
                    },
                });
            if (modo !== 'remover' && ids.length > 0)
                await tx.obraArtista.createMany({
                    data: obraIds.flatMap((obraId) => ids.map((artistaId) => ({ obraId, artistaId }))),
                    skipDuplicates: true,
                });
            return result;
        }
        if (modo !== 'remover' && ids.length > 0)
            await this.ensureCatalogs(tx, obraIds);
        const catalogs = await tx.catalogacao.findMany({
            where: { obraId: { in: obraIds } },
            select: { id: true },
        });
        const catalogIds = catalogs.map((catalog) => catalog.id);
        if (modo !== 'adicionar')
            await tx.catalogacaoTag.deleteMany({
                where: {
                    catalogacaoId: { in: catalogIds },
                    ...(modo === 'remover' ? { tagId: { in: ids } } : {}),
                },
            });
        if (modo !== 'remover' && ids.length > 0)
            await tx.catalogacaoTag.createMany({
                data: catalogIds.flatMap((catalogacaoId) => ids.map((tagId) => ({ catalogacaoId, tagId }))),
                skipDuplicates: true,
            });
        return result;
    }
    async ensureCatalogs(tx, obraIds) {
        await tx.catalogacao.createMany({
            data: obraIds.map((obraId) => ({ obraId })),
            skipDuplicates: true,
        });
    }
    async locationPaths(tx, projetoId) {
        const rows = await tx.localizacao.findMany({
            where: { projetoId },
            select: { id: true, nome: true, paiId: true },
        });
        const byId = new Map(rows.map((row) => [row.id, row]));
        return (id) => {
            if (!id)
                return null;
            const names = [];
            const seen = new Set();
            let cursor = byId.get(id);
            while (cursor && !seen.has(cursor.id)) {
                seen.add(cursor.id);
                names.unshift(cursor.nome);
                cursor = cursor.paiId ? byId.get(cursor.paiId) : undefined;
            }
            return names.join(' / ');
        };
    }
};
exports.BulkEditService = BulkEditService;
exports.BulkEditService = BulkEditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        advanced_search_service_1.AdvancedSearchService])
], BulkEditService);
//# sourceMappingURL=bulk-edit.service.js.map