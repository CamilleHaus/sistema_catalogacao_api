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
exports.TechniquesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const authorization_service_1 = require("../auth/authorization.service");
const prisma_service_1 = require("../database/prisma.service");
let TechniquesService = class TechniquesService {
    prisma;
    authorization;
    constructor(prisma, authorization) {
        this.prisma = prisma;
        this.authorization = authorization;
    }
    async list(user, query) {
        const empresaId = this.companyId(user);
        if (query.projetoId)
            await this.authorization.assertProjectAccess(user, query.projetoId);
        return this.prisma.tecnica.findMany({
            where: {
                empresaId,
                ...(query.projetoId
                    ? { OR: [{ projetoId: null }, { projetoId: query.projetoId }] }
                    : user.papel === client_1.PapelUsuario.ADMIN_EMPRESA
                        ? {}
                        : { projetoId: null }),
            },
            include: { projeto: { select: { id: true, nome: true } } },
            orderBy: [{ projetoId: 'asc' }, { nome: 'asc' }],
        });
    }
    async create(user, dto) {
        const empresaId = this.companyId(user);
        if (dto.projetoId) {
            const project = await this.prisma.projeto.findFirst({
                where: { id: dto.projetoId, empresaId },
                select: { id: true },
            });
            if (!project)
                throw new common_1.BadRequestException('Projeto inválido ou pertencente a outra empresa.');
        }
        try {
            return await this.prisma.tecnica.create({
                data: {
                    empresaId,
                    projetoId: dto.projetoId ?? null,
                    nome: dto.nome.trim(),
                },
                include: { projeto: { select: { id: true, nome: true } } },
            });
        }
        catch (error) {
            this.unique(error);
            throw error;
        }
    }
    async update(user, id, dto) {
        const item = await this.prisma.tecnica.findFirst({
            where: { id, empresaId: this.companyId(user) },
            select: { id: true },
        });
        if (!item)
            throw new common_1.NotFoundException('Técnica não encontrada.');
        try {
            return await this.prisma.tecnica.update({
                where: { id },
                data: { nome: dto.nome.trim() },
                include: { projeto: { select: { id: true, nome: true } } },
            });
        }
        catch (error) {
            this.unique(error);
            throw error;
        }
    }
    companyId(user) {
        if (!user.empresaId || user.papel === client_1.PapelUsuario.ADMIN_GLOBAL)
            throw new common_1.NotFoundException('Empresa não encontrada.');
        return user.empresaId;
    }
    unique(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002')
            throw new common_1.ConflictException('Já existe uma técnica com esse nome nesse escopo.');
    }
};
exports.TechniquesService = TechniquesService;
exports.TechniquesService = TechniquesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        authorization_service_1.AuthorizationService])
], TechniquesService);
//# sourceMappingURL=techniques.service.js.map