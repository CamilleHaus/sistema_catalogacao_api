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
exports.CatalogingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let CatalogingService = class CatalogingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    include = {
        categoria: true,
        tags: {
            include: { tag: true },
            orderBy: { tag: { nome: 'asc' } },
        },
        assinaturas: {
            include: { localAssinatura: true },
            orderBy: { criadoEm: 'asc' },
        },
        certificados: { orderBy: { criadoEm: 'asc' } },
    };
    async get(projetoId, obraId) {
        await this.context(projetoId, obraId);
        const item = await this.prisma.catalogacao.findUnique({
            where: { obraId },
            include: this.include,
        });
        return item ? this.present(item) : null;
    }
    async save(projetoId, obraId, dto) {
        const context = await this.context(projetoId, obraId);
        const tagIds = dto.tagIds === undefined ? undefined : [...new Set(dto.tagIds)];
        await this.validateReferences(context.empresaId, dto.categoriaId, tagIds);
        const scalar = {
            ...(dto.categoriaId === undefined
                ? {}
                : { categoriaId: dto.categoriaId || null }),
            ...(dto.proveniencia === undefined
                ? {}
                : { proveniencia: this.text(dto.proveniencia) }),
            ...(dto.observacoes === undefined
                ? {}
                : { observacoes: this.text(dto.observacoes) }),
        };
        const item = await this.prisma.$transaction(async (tx) => {
            const catalog = await tx.catalogacao.upsert({
                where: { obraId },
                create: { obraId, ...scalar },
                update: scalar,
            });
            if (tagIds !== undefined) {
                await tx.catalogacaoTag.deleteMany({
                    where: { catalogacaoId: catalog.id },
                });
                if (tagIds.length)
                    await tx.catalogacaoTag.createMany({
                        data: tagIds.map((tagId) => ({ catalogacaoId: catalog.id, tagId })),
                    });
            }
            return tx.catalogacao.findUniqueOrThrow({
                where: { id: catalog.id },
                include: this.include,
            });
        });
        return this.present(item);
    }
    async addSignature(projetoId, obraId, dto) {
        const { catalog, empresaId } = await this.requireCatalog(projetoId, obraId);
        await this.validLocation(dto.localAssinaturaId, empresaId);
        return this.prisma.assinatura.create({
            data: {
                catalogacaoId: catalog.id,
                localAssinaturaId: dto.localAssinaturaId,
                imagemUrl: this.text(dto.imagemUrl),
            },
            include: { localAssinatura: true },
        });
    }
    async updateSignature(projetoId, obraId, id, dto) {
        const { catalog, empresaId } = await this.requireCatalog(projetoId, obraId);
        await this.validLocation(dto.localAssinaturaId, empresaId);
        await this.requireChild('assinatura', id, catalog.id);
        return this.prisma.assinatura.update({
            where: { id },
            data: {
                localAssinaturaId: dto.localAssinaturaId,
                imagemUrl: this.text(dto.imagemUrl),
            },
            include: { localAssinatura: true },
        });
    }
    async removeSignature(projetoId, obraId, id) {
        const { catalog } = await this.requireCatalog(projetoId, obraId);
        await this.requireChild('assinatura', id, catalog.id);
        return this.prisma.assinatura.delete({ where: { id } });
    }
    async addCertificate(projetoId, obraId, dto) {
        const { catalog } = await this.requireCatalog(projetoId, obraId);
        return this.prisma.certificado.create({
            data: {
                catalogacaoId: catalog.id,
                imagemUrl: dto.imagemUrl.trim(),
                observacoes: this.text(dto.observacoes),
            },
        });
    }
    async updateCertificate(projetoId, obraId, id, dto) {
        const { catalog } = await this.requireCatalog(projetoId, obraId);
        await this.requireChild('certificado', id, catalog.id);
        return this.prisma.certificado.update({
            where: { id },
            data: {
                imagemUrl: dto.imagemUrl.trim(),
                observacoes: this.text(dto.observacoes),
            },
        });
    }
    async removeCertificate(projetoId, obraId, id) {
        const { catalog } = await this.requireCatalog(projetoId, obraId);
        await this.requireChild('certificado', id, catalog.id);
        return this.prisma.certificado.delete({ where: { id } });
    }
    async context(projetoId, obraId) {
        const work = await this.prisma.obra.findFirst({
            where: { id: obraId, projetoId },
            select: { id: true, projeto: { select: { empresaId: true } } },
        });
        if (!work)
            throw new common_1.NotFoundException('Obra não encontrada.');
        return { empresaId: work.projeto.empresaId };
    }
    async requireCatalog(projetoId, obraId) {
        const { empresaId } = await this.context(projetoId, obraId);
        const catalog = await this.prisma.catalogacao.findUnique({
            where: { obraId },
            select: { id: true },
        });
        if (!catalog)
            throw new common_1.BadRequestException('Crie a catalogação da obra antes de adicionar registros.');
        return { catalog, empresaId };
    }
    async validateReferences(empresaId, categoriaId, tagIds) {
        if (categoriaId &&
            !(await this.prisma.categoriaCatalogacao.findFirst({
                where: { id: categoriaId, empresaId },
            })))
            throw new common_1.BadRequestException('Categoria inválida para a empresa da obra.');
        if (tagIds?.length &&
            (await this.prisma.tag.count({
                where: { id: { in: tagIds }, empresaId },
            })) !== tagIds.length)
            throw new common_1.BadRequestException('Uma ou mais tags são inválidas para a empresa da obra.');
    }
    async validLocation(id, empresaId) {
        if (!(await this.prisma.localAssinatura.findFirst({
            where: { id, empresaId },
        })))
            throw new common_1.BadRequestException('Local de assinatura inválido para a empresa da obra.');
    }
    async requireChild(kind, id, catalogacaoId) {
        const found = kind === 'assinatura'
            ? await this.prisma.assinatura.findFirst({
                where: { id, catalogacaoId },
            })
            : await this.prisma.certificado.findFirst({
                where: { id, catalogacaoId },
            });
        if (!found)
            throw new common_1.NotFoundException('Registro não encontrado.');
    }
    text(value) {
        const result = value?.trim();
        return result || null;
    }
    present(item) {
        const { tags, ...rest } = item;
        return { ...rest, tags: tags.map(({ tag }) => tag) };
    }
};
exports.CatalogingService = CatalogingService;
exports.CatalogingService = CatalogingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogingService);
//# sourceMappingURL=cataloging.service.js.map