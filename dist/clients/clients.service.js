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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
let ClientsService = class ClientsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(currentUser) {
        return this.prisma.cliente.findMany({
            where: { empresaId: this.getCompanyId(currentUser) },
            include: { _count: { select: { projetos: true } } },
            orderBy: { nome: 'asc' },
        });
    }
    async create(currentUser, dto) {
        try {
            return await this.prisma.cliente.create({
                data: {
                    empresaId: this.getCompanyId(currentUser),
                    nome: dto.nome.trim(),
                    descricao: this.normalizeDescription(dto.descricao),
                    codigo: dto.codigo.trim().toUpperCase(),
                },
            });
        }
        catch (error) {
            this.handleUniqueConstraint(error);
            throw error;
        }
    }
    async findOne(currentUser, clienteId) {
        const cliente = await this.prisma.cliente.findFirst({
            where: { id: clienteId, empresaId: this.getCompanyId(currentUser) },
            include: {
                projetos: {
                    select: { id: true, nome: true, status: true },
                    orderBy: { nome: 'asc' },
                },
            },
        });
        if (!cliente)
            throw new common_1.NotFoundException('Cliente não encontrado.');
        return cliente;
    }
    async update(currentUser, clienteId, dto) {
        if (dto.nome === undefined && dto.descricao === undefined) {
            throw new common_1.BadRequestException('Informe nome ou descrição para atualização.');
        }
        const cliente = await this.prisma.cliente.findFirst({
            where: { id: clienteId, empresaId: this.getCompanyId(currentUser) },
            select: { id: true },
        });
        if (!cliente)
            throw new common_1.NotFoundException('Cliente não encontrado.');
        return this.prisma.cliente.update({
            where: { id: cliente.id },
            data: {
                ...(dto.nome === undefined ? {} : { nome: dto.nome.trim() }),
                ...(dto.descricao === undefined
                    ? {}
                    : { descricao: this.normalizeDescription(dto.descricao) }),
            },
        });
    }
    getCompanyId(user) {
        if (!user.empresaId)
            throw new common_1.NotFoundException('Empresa não encontrada.');
        return user.empresaId;
    }
    normalizeDescription(description) {
        const normalized = description?.trim();
        return normalized ? normalized : null;
    }
    handleUniqueConstraint(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException('Já existe um cliente com esse código na empresa.');
        }
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map