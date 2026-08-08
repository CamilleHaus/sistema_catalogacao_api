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
exports.DimensionsService = void 0;
const common_1 = require("@nestjs/common");
const measurements_1 = require("../common/utils/measurements");
const dimensions_1 = require("../common/utils/dimensions");
const prisma_service_1 = require("../database/prisma.service");
let DimensionsService = class DimensionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(projetoId, obraId, tipo, dto) {
        await this.requireWork(projetoId, obraId);
        const data = (0, dimensions_1.validateDimensionInput)(dto);
        const dimension = await this.prisma.dimensaoObra.upsert({
            where: { obraId_tipo: { obraId, tipo } },
            create: { obraId, tipo, ...data },
            update: data,
        });
        return (0, measurements_1.presentDimension)(dimension);
    }
    async remove(projetoId, obraId, tipo) {
        await this.requireWork(projetoId, obraId);
        const result = await this.prisma.dimensaoObra.deleteMany({
            where: { obraId, tipo },
        });
        return { removida: result.count > 0 };
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
exports.DimensionsService = DimensionsService;
exports.DimensionsService = DimensionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DimensionsService);
//# sourceMappingURL=dimensions.service.js.map