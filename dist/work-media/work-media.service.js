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
exports.WorkMediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const storage_service_1 = require("../storage/storage.service");
let WorkMediaService = class WorkMediaService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async gallery(projetoId, obraId) {
        await this.requireWork(projetoId, obraId);
        const [images, signatures] = await Promise.all([
            this.prisma.imagemObra.findMany({
                where: { obraId },
                orderBy: { criadoEm: 'desc' },
                include: { principalDe: { select: { id: true } } },
            }),
            this.prisma.assinatura.findMany({
                where: { catalogacao: { obraId }, imagemUrl: { not: null } },
                orderBy: { criadoEm: 'desc' },
                include: { localAssinatura: { select: { id: true, nome: true } } },
            }),
        ]);
        return {
            imagens: images.map(({ principalDe, ...image }) => ({
                ...image,
                principal: principalDe?.id === obraId,
            })),
            assinaturas: signatures,
        };
    }
    async createImage(projetoId, obraId, dto) {
        await this.requireWork(projetoId, obraId);
        return this.prisma.imagemObra.create({
            data: {
                obraId,
                imagemUrl: dto.imagemUrl.trim(),
                creditos: this.text(dto.creditos),
                observacoes: this.text(dto.observacoes),
            },
        });
    }
    async updateImage(projetoId, obraId, id, dto) {
        await this.requireImage(projetoId, obraId, id);
        if (Object.values(dto).every((value) => value === undefined))
            throw new common_1.BadRequestException('Informe ao menos um campo.');
        return this.prisma.imagemObra.update({
            where: { id },
            data: this.imageData(dto),
        });
    }
    async setMain(projetoId, obraId, id) {
        return this.prisma.$transaction(async (tx) => {
            const work = await tx.obra.findFirst({
                where: { id: obraId, projetoId },
                select: { id: true },
            });
            if (!work)
                throw new common_1.NotFoundException('Obra não encontrada.');
            const image = await tx.imagemObra.findFirst({
                where: { id, obraId },
                select: { id: true, imagemUrl: true },
            });
            if (!image)
                throw new common_1.NotFoundException('Imagem da obra não encontrada.');
            await tx.obra.update({
                where: { id: obraId },
                data: {
                    imagemPrincipalId: image.id,
                    fotoPrincipalUrl: image.imagemUrl,
                },
            });
            return { imagemId: image.id, principal: true };
        });
    }
    async removeImage(projetoId, obraId, id) {
        const removed = await this.prisma.$transaction(async (tx) => {
            const work = await tx.obra.findFirst({
                where: { id: obraId, projetoId },
                select: { imagemPrincipalId: true },
            });
            if (!work)
                throw new common_1.NotFoundException('Obra não encontrada.');
            const image = await tx.imagemObra.findFirst({
                where: { id, obraId },
                select: { id: true },
            });
            if (!image)
                throw new common_1.NotFoundException('Imagem da obra não encontrada.');
            if (work.imagemPrincipalId === id)
                await tx.obra.update({
                    where: { id: obraId },
                    data: { imagemPrincipalId: null, fotoPrincipalUrl: null },
                });
            return tx.imagemObra.delete({ where: { id } });
        });
        await this.storage.removeByUrl(removed.imagemUrl);
        return removed;
    }
    async listAttachments(projetoId, obraId) {
        await this.requireWork(projetoId, obraId);
        const items = await this.prisma.anexoObra.findMany({
            where: { obraId },
            orderBy: { criadoEm: 'desc' },
        });
        return items;
    }
    async createAttachment(projetoId, obraId, dto) {
        await this.requireWork(projetoId, obraId);
        const item = await this.prisma.anexoObra.create({
            data: { obraId, ...this.attachmentData(dto) },
        });
        return item;
    }
    async updateAttachment(projetoId, obraId, id, dto) {
        await this.requireAttachment(projetoId, obraId, id);
        const item = await this.prisma.anexoObra.update({
            where: { id },
            data: this.attachmentData(dto),
        });
        return item;
    }
    async removeAttachment(projetoId, obraId, id) {
        await this.requireAttachment(projetoId, obraId, id);
        return this.prisma.anexoObra.delete({ where: { id } });
    }
    imageData(dto) {
        return {
            ...(dto.imagemUrl === undefined
                ? {}
                : { imagemUrl: dto.imagemUrl.trim() }),
            ...(dto.creditos === undefined
                ? {}
                : { creditos: this.text(dto.creditos) }),
            ...(dto.observacoes === undefined
                ? {}
                : { observacoes: this.text(dto.observacoes) }),
        };
    }
    attachmentData(dto) {
        const pathname = new URL(dto.arquivoUrl).pathname;
        const filename = pathname.slice(pathname.lastIndexOf('/') + 1);
        const dot = filename.lastIndexOf('.');
        return {
            arquivoUrl: dto.arquivoUrl.trim(),
            tipo: dto.tipo,
            observacoes: this.text(dto.observacoes),
            extensao: dot > 0 && dot < filename.length - 1
                ? filename.slice(dot + 1).toLowerCase()
                : null,
        };
    }
    async requireWork(projetoId, obraId) {
        const item = await this.prisma.obra.findFirst({
            where: { id: obraId, projetoId },
            select: { id: true },
        });
        if (!item)
            throw new common_1.NotFoundException('Obra não encontrada.');
        return item;
    }
    async requireImage(projetoId, obraId, id) {
        await this.requireWork(projetoId, obraId);
        const item = await this.prisma.imagemObra.findFirst({
            where: { id, obraId },
            select: { id: true },
        });
        if (!item)
            throw new common_1.NotFoundException('Imagem da obra não encontrada.');
        return item;
    }
    async requireAttachment(projetoId, obraId, id) {
        await this.requireWork(projetoId, obraId);
        const item = await this.prisma.anexoObra.findFirst({
            where: { id, obraId },
            select: { id: true },
        });
        if (!item)
            throw new common_1.NotFoundException('Anexo não encontrado.');
        return item;
    }
    text(value) {
        const text = value?.trim();
        return text || null;
    }
};
exports.WorkMediaService = WorkMediaService;
exports.WorkMediaService = WorkMediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], WorkMediaService);
//# sourceMappingURL=work-media.service.js.map