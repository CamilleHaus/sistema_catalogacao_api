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
let WorkPhotosService = class WorkPhotosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async update(projetoId, obraId, rawUrl) {
        await this.requireWork(projetoId, obraId);
        return this.prisma.obra.update({
            where: { id: obraId },
            data: { fotoPrincipalUrl: rawUrl.trim() },
            select: { id: true, fotoPrincipalUrl: true, atualizadoEm: true },
        });
    }
    async remove(projetoId, obraId) {
        await this.requireWork(projetoId, obraId);
        return this.prisma.obra.update({
            where: { id: obraId },
            data: { fotoPrincipalUrl: null },
            select: { id: true, fotoPrincipalUrl: true, atualizadoEm: true },
        });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkPhotosService);
//# sourceMappingURL=work-photos.service.js.map