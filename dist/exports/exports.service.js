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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportsService = void 0;
const common_1 = require("@nestjs/common");
const advanced_search_service_1 = require("../advanced-search/advanced-search.service");
const prisma_service_1 = require("../database/prisma.service");
const export_fields_1 = require("./export-fields");
const sharp_1 = __importDefault(require("sharp"));
const storage_service_1 = require("../storage/storage.service");
const list_1 = require("./renderers/list");
const sheet_1 = require("./renderers/sheet");
const FICHA_FIELDS = [
    'numeroManual',
    'data',
    'edicao',
    'tecnica',
    'dimensoes',
    'status',
    'localizacao',
    'fichaMae',
    'quantidadePartes',
    'tituloSerie',
];
const IN_HEADER = new Set(['codigoAcervo', 'titulo', 'artistas']);
const INSTRUCTION_LABEL = {
    EMBALAGEM: 'Embalagem',
    TRANSPORTE: 'Transporte',
    MANUSEIO: 'Manuseio',
};
const DATE = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });
const IMAGE_BATCH = 4;
let ExportsService = class ExportsService {
    prisma;
    search;
    storage;
    constructor(prisma, search, storage) {
        this.prisma = prisma;
        this.search = search;
        this.storage = storage;
    }
    fields() {
        return {
            campos: export_fields_1.EXPORT_FIELDS.map((field) => ({
                id: field.id,
                label: field.label,
                grupo: field.group,
            })),
        };
    }
    async export(projetoId, usuarioId, dto) {
        const fields = [...new Set(dto.campos)].map((id) => {
            const field = export_fields_1.EXPORT_FIELDS_BY_ID.get(id);
            if (!field)
                throw new common_1.BadRequestException(`O campo "${id}" não pode ser exportado.`);
            return field;
        });
        fields.sort((a, b) => export_fields_1.EXPORT_FIELDS.indexOf(a) - export_fields_1.EXPORT_FIELDS.indexOf(b));
        const project = await this.prisma.projeto.findUnique({
            where: { id: projetoId },
            select: { nome: true, cliente: { select: { nome: true } } },
        });
        if (!project)
            throw new common_1.NotFoundException('Projeto não encontrado.');
        const ids = await this.resolveScope(projetoId, usuarioId, dto.escopo);
        const works = await this.prisma.obra.findMany({
            where: { projetoId, ...(ids ? { id: { in: ids } } : {}) },
            include: {
                ...(0, export_fields_1.includeFor)(fields),
                ...(dto.saida === 'pdf'
                    ? {
                        artistas: { include: { artista: true } },
                        imagemPrincipal: { select: { imagemUrl: true } },
                    }
                    : {}),
            },
            orderBy: { codigoAcervo: 'asc' },
        });
        const ctx = await this.context(projetoId);
        const date = new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
        }).format(new Date());
        const stamp = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Sao_Paulo',
        }).format(new Date());
        const count = `${works.length} ${works.length === 1 ? 'obra' : 'obras'}`;
        if (dto.saida === 'csv') {
            const csv = (0, list_1.listToCsv)({
                headers: fields.map((field) => field.label),
                rows: works.map((work) => fields.map((field) => field.read(work, ctx))),
            });
            return {
                filename: `lista-${slug(project.nome)}-${stamp}.csv`,
                contentType: 'text/csv; charset=utf-8',
                body: csv,
            };
        }
        const ficha = FICHA_FIELDS.map((id) => fields.find((field) => field.id === id)).filter((field) => field !== undefined);
        const others = fields.filter((field) => !FICHA_FIELDS.includes(field.id) && !IN_HEADER.has(field.id));
        const sectionNames = [...new Set(others.map((field) => field.group))];
        const recordImages = dto.imagens === false
            ? new Map()
            : await this.recordImages(works.map((work) => work.id));
        const galleries = dto.imagens === false
            ? new Map()
            : await this.galleries(works.map((work) => work.id));
        const sheets = [];
        for (let start = 0; start < works.length; start += IMAGE_BATCH) {
            const batch = works.slice(start, start + IMAGE_BATCH);
            sheets.push(...(await Promise.all(batch.map(async (work) => {
                const mainUrl = work
                    .imagemPrincipal?.imagemUrl ?? work.fotoPrincipalUrl;
                return {
                    codigo: work.codigoAcervo,
                    titulo: displayTitle(work),
                    artistas: work.artistas
                        .map(({ artista }) => artista.nome)
                        .join(', '),
                    image: await this.image(mainUrl),
                    ficha: ficha.map((field) => ({
                        label: field.label,
                        value: field.read(work, ctx),
                    })),
                    sections: await Promise.all(sectionNames.map(async (title) => ({
                        title,
                        fields: others
                            .filter((field) => field.group === title)
                            .map((field) => ({
                            label: field.label,
                            value: field.read(work, ctx),
                        })),
                        images: await this.convertImages(recordImages.get(work.id)?.get(title) ?? [], 600),
                    }))),
                    gallery: await this.convertImages((galleries.get(work.id) ?? []).filter((item) => item.url !== mainUrl)),
                };
            }))));
        }
        const pdf = await (0, sheet_1.sheetsToPdf)({
            title: `Obras — ${project.nome}`,
            context: `${project.nome} · ${project.cliente.nome} · ${count}`,
            generatedAt: date,
            works: sheets,
        });
        return {
            filename: `fichas-${slug(project.nome)}-${stamp}.pdf`,
            contentType: 'application/pdf',
            body: pdf,
        };
    }
    async galleries(obraIds) {
        const images = await this.prisma.imagemObra.findMany({
            where: { obraId: { in: obraIds } },
            orderBy: { criadoEm: 'asc' },
            select: { obraId: true, imagemUrl: true, creditos: true },
        });
        const result = new Map();
        for (const image of images)
            result.set(image.obraId, [
                ...(result.get(image.obraId) ?? []),
                { url: image.imagemUrl, caption: image.creditos?.trim() || null },
            ]);
        return result;
    }
    async recordImages(obraIds) {
        const inWorks = { in: obraIds };
        const asc = { criadoEm: 'asc' };
        const day = (date) => (date ? DATE.format(date) : '');
        const [certificados, assinaturas, analises, instrucoes, publicacoes, notas, pagamentos, vendas,] = await Promise.all([
            this.prisma.certificado.findMany({
                where: { catalogacao: { obraId: inWorks } },
                orderBy: asc,
                select: { imagemUrl: true, catalogacao: { select: { obraId: true } } },
            }),
            this.prisma.assinatura.findMany({
                where: { catalogacao: { obraId: inWorks }, imagemUrl: { not: null } },
                orderBy: asc,
                select: {
                    imagemUrl: true,
                    localAssinatura: { select: { nome: true } },
                    catalogacao: { select: { obraId: true } },
                },
            }),
            this.prisma.imagemAnaliseConservacao.findMany({
                where: { analise: { obraId: inWorks } },
                orderBy: asc,
                select: {
                    imagemUrl: true,
                    creditos: true,
                    analise: { select: { obraId: true, data: true } },
                },
            }),
            this.prisma.imagemInstrucaoObra.findMany({
                where: { instrucao: { obraId: inWorks } },
                orderBy: asc,
                select: {
                    imagemUrl: true,
                    instrucao: { select: { obraId: true, tipo: true } },
                },
            }),
            this.prisma.imagemPublicacao.findMany({
                where: { publicacao: { obraId: inWorks } },
                orderBy: asc,
                select: {
                    imagemUrl: true,
                    publicacao: { select: { obraId: true, titulo: true } },
                },
            }),
            this.prisma.notaFiscalAquisicao.findMany({
                where: { aquisicao: { obraId: inWorks }, imagemUrl: { not: null } },
                orderBy: asc,
                select: {
                    imagemUrl: true,
                    numero: true,
                    aquisicao: { select: { obraId: true } },
                },
            }),
            this.prisma.comprovantePagamento.findMany({
                where: { aquisicao: { obraId: inWorks }, imagemUrl: { not: null } },
                orderBy: asc,
                select: {
                    imagemUrl: true,
                    data: true,
                    aquisicao: { select: { obraId: true } },
                },
            }),
            this.prisma.comprovanteVenda.findMany({
                where: { venda: { obraId: inWorks }, imagemUrl: { not: null } },
                orderBy: asc,
                select: {
                    imagemUrl: true,
                    data: true,
                    venda: { select: { obraId: true } },
                },
            }),
        ]);
        const result = new Map();
        const push = (obraId, section, url, caption) => {
            if (!url)
                return;
            const bySection = result.get(obraId) ?? new Map();
            bySection.set(section, [
                ...(bySection.get(section) ?? []),
                { url, caption: caption.trim() || null },
            ]);
            result.set(obraId, bySection);
        };
        for (const item of certificados)
            push(item.catalogacao.obraId, 'Catalogação', item.imagemUrl, 'Certificado');
        for (const item of assinaturas)
            push(item.catalogacao.obraId, 'Catalogação', item.imagemUrl, `Assinatura — ${item.localAssinatura.nome}`);
        for (const item of analises)
            push(item.analise.obraId, 'Conservação', item.imagemUrl, item.creditos?.trim() || `Análise ${day(item.analise.data)}`);
        for (const item of instrucoes)
            push(item.instrucao.obraId, 'Instruções', item.imagemUrl, INSTRUCTION_LABEL[item.instrucao.tipo ?? ''] ?? 'Instrução');
        for (const item of publicacoes)
            push(item.publicacao.obraId, 'Pesquisa', item.imagemUrl, item.publicacao.titulo ?? 'Publicação');
        for (const item of notas)
            push(item.aquisicao.obraId, 'Aquisição', item.imagemUrl, `Nota fiscal ${item.numero ?? ''}`);
        for (const item of pagamentos)
            push(item.aquisicao.obraId, 'Aquisição', item.imagemUrl, `Comprovante de pagamento ${day(item.data)}`);
        for (const item of vendas)
            push(item.venda.obraId, 'Venda', item.imagemUrl, `Comprovante de venda ${day(item.data)}`);
        return result;
    }
    async convertImages(items, maxSize = 900) {
        const result = [];
        for (const item of items) {
            const image = await this.image(item.url, maxSize);
            if (image)
                result.push({ ...image, caption: item.caption });
        }
        return result;
    }
    async image(url, maxSize = 1400) {
        if (!url)
            return null;
        const original = await this.storage.read(url);
        if (!original)
            return null;
        try {
            const { data, info } = await (0, sharp_1.default)(original)
                .rotate()
                .resize({
                width: maxSize,
                height: maxSize,
                fit: 'inside',
                withoutEnlargement: true,
            })
                .flatten({ background: '#ffffff' })
                .jpeg({ quality: 82 })
                .toBuffer({ resolveWithObject: true });
            return { data, width: info.width, height: info.height };
        }
        catch {
            return null;
        }
    }
    async resolveScope(projetoId, usuarioId, scope) {
        if (scope.tipo === 'todas')
            return null;
        if (scope.tipo === 'obras') {
            if (!scope.obraIds?.length)
                throw new common_1.BadRequestException('Nenhuma obra para exportar.');
            return [...new Set(scope.obraIds)];
        }
        if (!scope.filtroId)
            throw new common_1.BadRequestException('Escolha o filtro salvo.');
        const filter = await this.prisma.filtroBuscaSalvo.findFirst({
            where: { id: scope.filtroId, projetoId, usuarioId },
        });
        if (!filter)
            throw new common_1.NotFoundException('Filtro não encontrado.');
        const works = await this.search.search(projetoId, {
            combinar: filter.combinar,
            condicoes: filter.condicoes,
        });
        return works.map((work) => work.id);
    }
    async context(projetoId) {
        const [options, locations] = await Promise.all([
            this.search.optionSources(projetoId),
            this.prisma.localizacao.findMany({
                where: { projetoId },
                select: { id: true, nome: true, paiId: true },
            }),
        ]);
        const labels = Object.fromEntries(Object.entries(options).map(([source, list]) => [
            source,
            new Map(list.map((option) => [
                option.value,
                option.label.replace(/^(— )+/, ''),
            ])),
        ]));
        const byId = new Map(locations.map((row) => [row.id, row]));
        const path = (id) => {
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
        labels['localizacoes'] = new Map(locations.map((row) => [row.id, path(row.id)]));
        return { labels };
    }
};
exports.ExportsService = ExportsService;
exports.ExportsService = ExportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        advanced_search_service_1.AdvancedSearchService,
        storage_service_1.StorageService])
], ExportsService);
function displayTitle(work) {
    const base = work.titulo?.trim() || 'Sem título';
    const withSeries = work.serie && work.tituloSerie
        ? `${base}, série ${work.tituloSerie}`
        : base;
    return work.data?.trim() ? `${withSeries}, ${work.data.trim()}` : withSeries;
}
function slug(text) {
    return (text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'projeto');
}
//# sourceMappingURL=exports.service.js.map