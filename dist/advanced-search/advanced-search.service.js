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
exports.AdvancedSearchService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
const works_service_1 = require("../works/works.service");
const search_fields_1 = require("./search-fields");
const NO_VALUE = new Set(['sim', 'nao']);
const NUMBER = /^\d+(\.\d+)?$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
let AdvancedSearchService = class AdvancedSearchService {
    prisma;
    works;
    constructor(prisma, works) {
        this.prisma = prisma;
        this.works = works;
    }
    async fields(projetoId) {
        const options = await this.optionSources(projetoId);
        return search_fields_1.SEARCH_FIELDS.map((field) => ({
            id: field.id,
            label: field.label,
            grupo: field.group,
            tipo: field.type,
            operadores: search_fields_1.OPERATORS[field.type],
            ...(field.source || field.enumOptions
                ? {
                    opcoes: field.source ? options[field.source] : field.enumOptions,
                }
                : {}),
        }));
    }
    async search(projetoId, dto) {
        const conditions = await this.resolve(projetoId, dto.condicoes);
        const clauses = conditions.map(search_fields_1.buildCondition);
        return this.works.listWhere(projetoId, {
            ...(clauses.length === 0
                ? {}
                : dto.combinar === client_1.CombinacaoFiltro.TODAS
                    ? { AND: clauses }
                    : { OR: clauses }),
        });
    }
    listFilters(projetoId, usuarioId) {
        return this.prisma.filtroBuscaSalvo.findMany({
            where: { projetoId, usuarioId },
            orderBy: { nome: 'asc' },
        });
    }
    async createFilter(projetoId, usuarioId, dto) {
        await this.resolve(projetoId, dto.condicoes);
        return this.saving(() => this.prisma.filtroBuscaSalvo.create({
            data: { projetoId, usuarioId, ...this.filterData(dto) },
        }));
    }
    async updateFilter(projetoId, usuarioId, filtroId, dto) {
        await this.requireFilter(projetoId, usuarioId, filtroId);
        await this.resolve(projetoId, dto.condicoes);
        return this.saving(() => this.prisma.filtroBuscaSalvo.update({
            where: { id: filtroId },
            data: this.filterData(dto),
        }));
    }
    async removeFilter(projetoId, usuarioId, filtroId) {
        await this.requireFilter(projetoId, usuarioId, filtroId);
        await this.prisma.filtroBuscaSalvo.delete({ where: { id: filtroId } });
    }
    async resolve(projetoId, conditions) {
        const resolved = conditions.map((condition, index) => this.validate(condition, index + 1));
        if (resolved.some(({ field }) => field.expandTree)) {
            const expand = await this.locationExpander(projetoId);
            for (const condition of resolved) {
                if (condition.field.expandTree && Array.isArray(condition.value))
                    condition.value = expand(condition.value);
            }
        }
        return resolved;
    }
    validate({ campo, operador, valor }, position) {
        const field = search_fields_1.FIELDS_BY_ID.get(campo);
        const fail = (message) => {
            throw new common_1.BadRequestException(`Condição ${position}: ${message}`);
        };
        if (!field)
            return fail(`o campo "${campo}" não existe mais na busca.`);
        if (!search_fields_1.OPERATORS[field.type].includes(operador))
            return fail(`operador inválido para "${field.label}".`);
        if (NO_VALUE.has(operador))
            return { field, operator: operador };
        if (field.type === 'opcao' || field.type === 'multipla') {
            if (!Array.isArray(valor) ||
                valor.length === 0 ||
                valor.length > 200 ||
                !valor.every((item) => typeof item === 'string' && item.length <= 100))
                return fail(`escolha ao menos uma opção em "${field.label}".`);
            return { field, operator: operador, value: valor };
        }
        const single = (raw) => this.scalar(field, raw, fail);
        if (operador === 'entre') {
            if (!Array.isArray(valor) || valor.length !== 2)
                return fail(`informe o início e o fim em "${field.label}".`);
            const range = [single(valor[0]), single(valor[1])];
            if (this.compare(field, range[0], range[1]) > 0)
                return fail(`o início é maior que o fim em "${field.label}".`);
            return { field, operator: operador, value: range };
        }
        return { field, operator: operador, value: single(valor) };
    }
    scalar(field, raw, fail) {
        const value = typeof raw === 'string' ? raw.trim() : '';
        if (!value)
            return fail(`informe um valor em "${field.label}".`);
        if (field.type === 'texto') {
            if (value.length > 300)
                return fail('texto longo demais.');
            return value;
        }
        if (field.type === 'data') {
            if (!DATE.test(value) || Number.isNaN(Date.parse(value)))
                return fail(`data inválida em "${field.label}".`);
            return value;
        }
        if (!NUMBER.test(value))
            return fail(`número inválido em "${field.label}".`);
        return value;
    }
    compare(field, a, b) {
        if (field.type === 'data')
            return a.localeCompare(b);
        return new client_1.Prisma.Decimal(a).comparedTo(new client_1.Prisma.Decimal(b));
    }
    async locationExpander(projetoId) {
        const rows = await this.prisma.localizacao.findMany({
            where: { projetoId },
            select: { id: true, paiId: true },
        });
        const children = new Map();
        for (const row of rows) {
            if (!row.paiId)
                continue;
            children.set(row.paiId, [...(children.get(row.paiId) ?? []), row.id]);
        }
        return (ids) => {
            const result = new Set();
            const queue = [...ids];
            while (queue.length > 0) {
                const id = queue.pop();
                if (result.has(id))
                    continue;
                result.add(id);
                queue.push(...(children.get(id) ?? []));
            }
            return [...result];
        };
    }
    async optionSources(projetoId) {
        const project = await this.prisma.projeto.findUnique({
            where: { id: projetoId },
            select: { empresaId: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Projeto não encontrado.');
        const empresaId = project.empresaId;
        const byName = { orderBy: { nome: 'asc' } };
        const named = (rows) => rows.map((row) => ({ value: row.id, label: row.nome }));
        const [artistas, status, tecnicas, localizacoes, fichasMae, categorias, tags, locaisAssinatura, estadosConservacao, tiposServico, formasNegociacao, modalidadesSeguro,] = await Promise.all([
            this.prisma.artista.findMany({ where: { empresaId }, ...byName }),
            this.prisma.statusObra.findMany({ where: { empresaId }, ...byName }),
            this.prisma.tecnica.findMany({
                where: { empresaId, OR: [{ projetoId: null }, { projetoId }] },
                ...byName,
            }),
            this.prisma.localizacao.findMany({ where: { projetoId }, ...byName }),
            this.prisma.fichaMae.findMany({
                where: { projetoId },
                orderBy: { codigo: 'asc' },
            }),
            this.prisma.categoriaCatalogacao.findMany({
                where: { empresaId },
                ...byName,
            }),
            this.prisma.tag.findMany({ where: { empresaId }, ...byName }),
            this.prisma.localAssinatura.findMany({ where: { empresaId }, ...byName }),
            this.prisma.estadoConservacao.findMany({
                where: { empresaId },
                ...byName,
            }),
            this.prisma.tipoServicoObra.findMany({ where: { empresaId }, ...byName }),
            this.prisma.formaNegociacao.findMany({ where: { empresaId }, ...byName }),
            this.prisma.modalidadeSeguro.findMany({
                where: { empresaId },
                ...byName,
            }),
        ]);
        return {
            artistas: named(artistas),
            status: named(status),
            tecnicas: named(tecnicas),
            localizacoes: this.locationOptions(localizacoes),
            fichasMae: fichasMae.map((item) => ({
                value: item.id,
                label: `${item.codigo} — ${item.descricao}`,
            })),
            categorias: named(categorias),
            tags: named(tags),
            locaisAssinatura: named(locaisAssinatura),
            estadosConservacao: named(estadosConservacao),
            tiposServico: named(tiposServico),
            formasNegociacao: named(formasNegociacao),
            modalidadesSeguro: named(modalidadesSeguro),
        };
    }
    locationOptions(rows) {
        const children = new Map();
        for (const row of rows) {
            const parent = rows.some((item) => item.id === row.paiId)
                ? row.paiId
                : null;
            children.set(parent, [...(children.get(parent) ?? []), row]);
        }
        const result = [];
        const visit = (parent, depth) => {
            for (const row of children.get(parent) ?? []) {
                result.push({
                    value: row.id,
                    label: `${'— '.repeat(depth)}${row.nome}`,
                });
                visit(row.id, depth + 1);
            }
        };
        visit(null, 0);
        return result;
    }
    filterData(dto) {
        return {
            nome: dto.nome,
            combinar: dto.combinar,
            condicoes: dto.condicoes.map(({ campo, operador, valor }) => ({
                campo,
                operador,
                ...(valor === undefined ? {} : { valor }),
            })),
        };
    }
    async requireFilter(projetoId, usuarioId, filtroId) {
        const filter = await this.prisma.filtroBuscaSalvo.findFirst({
            where: { id: filtroId, projetoId, usuarioId },
            select: { id: true },
        });
        if (!filter)
            throw new common_1.NotFoundException('Filtro não encontrado.');
    }
    async saving(run) {
        try {
            return await run();
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002')
                throw new common_1.ConflictException('Você já tem um filtro com esse nome.');
            throw error;
        }
    }
};
exports.AdvancedSearchService = AdvancedSearchService;
exports.AdvancedSearchService = AdvancedSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        works_service_1.WorksService])
], AdvancedSearchService);
//# sourceMappingURL=advanced-search.service.js.map