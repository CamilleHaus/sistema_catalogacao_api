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
exports.WorkStatusesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
let WorkStatusesService = class WorkStatusesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(user) {
        return this.prisma.statusObra.findMany({
            where: { empresaId: this.companyId(user) },
            orderBy: { nome: 'asc' },
        });
    }
    async create(user, dto) {
        try {
            return await this.prisma.statusObra.create({
                data: { empresaId: this.companyId(user), nome: dto.nome.trim() },
            });
        }
        catch (error) {
            this.unique(error);
            throw error;
        }
    }
    async update(user, id, dto) {
        const item = await this.prisma.statusObra.findFirst({
            where: { id, empresaId: this.companyId(user) },
            select: { id: true },
        });
        if (!item)
            throw new common_1.NotFoundException('Status não encontrado.');
        try {
            return await this.prisma.statusObra.update({
                where: { id },
                data: { nome: dto.nome.trim() },
            });
        }
        catch (error) {
            this.unique(error);
            throw error;
        }
    }
    companyId(user) {
        if (!user.empresaId)
            throw new common_1.NotFoundException('Empresa não encontrada.');
        return user.empresaId;
    }
    unique(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002')
            throw new common_1.ConflictException('Já existe um status com esse nome na empresa.');
    }
};
exports.WorkStatusesService = WorkStatusesService;
exports.WorkStatusesService = WorkStatusesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkStatusesService);
//# sourceMappingURL=work-statuses.service.js.map