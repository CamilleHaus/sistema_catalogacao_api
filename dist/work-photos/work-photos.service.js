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
exports.WorkPhotosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const storage_service_1 = require("../storage/storage.service");
let WorkPhotosService = class WorkPhotosService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async update(projetoId, obraId, rawUrl, rawCredits) {
        await this.requireWork(projetoId, obraId);
        return this.prisma.$transaction(async (tx) => {
            const current = await tx.obra.findUniqueOrThrow({
                where: { id: obraId },
                select: { imagemPrincipal: { select: { id: true, imagemUrl: true } } },
            });
            const normalizedUrl = rawUrl.trim();
            const credits = rawCredits?.trim() || null;
            if (current.imagemPrincipal?.imagemUrl === normalizedUrl) {
                await tx.imagemObra.update({
                    where: { id: current.imagemPrincipal.id },
                    data: { creditos: credits },
                });
                return tx.obra.findUniqueOrThrow({
                    where: { id: obraId },
                    select: {
                        id: true,
                        fotoPrincipalUrl: true,
                        imagemPrincipalId: true,
                        imagemPrincipal: true,
                        atualizadoEm: true,
                    },
                });
            }
            const image = await tx.imagemObra.create({
                data: {
                    obraId,
                    imagemUrl: normalizedUrl,
                    creditos: credits,
                },
            });
            return tx.obra.update({
                where: { id: obraId },
                data: {
                    fotoPrincipalUrl: image.imagemUrl,
                    imagemPrincipalId: image.id,
                },
                select: {
                    id: true,
                    fotoPrincipalUrl: true,
                    imagemPrincipalId: true,
                    imagemPrincipal: true,
                    atualizadoEm: true,
                },
            });
        });
    }
    async remove(projetoId, obraId) {
        await this.requireWork(projetoId, obraId);
        const { result, urlRemovida } = await this.prisma.$transaction(async (tx) => {
            const work = await tx.obra.findUniqueOrThrow({
                where: { id: obraId },
                select: { imagemPrincipal: { select: { id: true, imagemUrl: true } } },
            });
            const result = await tx.obra.update({
                where: { id: obraId },
                data: { fotoPrincipalUrl: null, imagemPrincipalId: null },
                select: {
                    id: true,
                    fotoPrincipalUrl: true,
                    imagemPrincipalId: true,
                    atualizadoEm: true,
                },
            });
            if (work.imagemPrincipal)
                await tx.imagemObra.delete({ where: { id: work.imagemPrincipal.id } });
            return { result, urlRemovida: work.imagemPrincipal?.imagemUrl ?? null };
        });
        if (urlRemovida)
            await this.storage.removeByUrl(urlRemovida);
        return result;
    }
    async requireWork(projetoId, obraId) {
        const work = await this.prisma.obra.findFirst({
            where: { id: obraId, projetoId },
            select: { id: true },
        });
        if (!work)
            throw new common_1.NotFoundException('Obra não encontrada.');
    }
};
exports.WorkPhotosService = WorkPhotosService;
exports.WorkPhotosService = WorkPhotosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], WorkPhotosService);
//# sourceMappingURL=work-photos.service.js.map