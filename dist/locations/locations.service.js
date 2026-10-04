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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
const LINK_COUNT = {
    _count: {
        select: {
            obras: true,
            movimentacoesSaida: true,
            movimentacoesEntrada: true,
        },
    },
};
let LocationsService = class LocationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listTree(projetoId) {
        const rows = await this.prisma.localizacao.findMany({
            where: { projetoId },
            orderBy: { nome: 'asc' },
            include: LINK_COUNT,
        });
        return this.buildTree(rows.map(({ _count, ...row }) => ({
            ...row,
            vinculos: _count.obras +
                _count.movimentacoesSaida +
                _count.movimentacoesEntrada,
        })));
    }
    async remove(user, projetoId, localizacaoId) {
        this.assertCompany(user);
        await this.requireLocation(projetoId, localizacaoId);
        const location = await this.prisma.localizacao.findUniqueOrThrow({
            where: { id: localizacaoId },
            include: {
                _count: { select: { ...LINK_COUNT._count.select, filhos: true } },
            },
        });
        const { filhos, obras, movimentacoesSaida, movimentacoesEntrada } = location._count;
        if (filhos > 0) {
            throw new common_1.ConflictException('Exclua as sublocalizações antes de excluir esta localização.');
        }
        if (obras + movimentacoesSaida + movimentacoesEntrada > 0) {
            throw new common_1.ConflictException('Esta localização tem obras ou movimentações vinculadas e não pode ser excluída.');
        }
        try {
            await this.prisma.localizacao.delete({ where: { id: localizacaoId } });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2003') {
                throw new common_1.ConflictException('Esta localização tem vínculos e não pode ser excluída.');
            }
            throw error;
        }
    }
    async create(user, projetoId, dto) {
        this.assertCompany(user);
        if (dto.paiId)
            await this.requireLocation(projetoId, dto.paiId);
        try {
            return await this.prisma.localizacao.create({
                data: { projetoId, nome: dto.nome.trim(), paiId: dto.paiId ?? null },
            });
        }
        catch (error) {
            this.handleUnique(error);
            throw error;
        }
    }
    async update(user, projetoId, localizacaoId, dto) {
        this.assertCompany(user);
        if (dto.nome === undefined && dto.paiId === undefined) {
            throw new common_1.BadRequestException('Informe nome ou localização-pai.');
        }
        await this.requireLocation(projetoId, localizacaoId);
        if (dto.paiId !== undefined && dto.paiId !== null) {
            if (dto.paiId === localizacaoId) {
                throw new common_1.BadRequestException('Uma localização não pode ser pai de si mesma.');
            }
            await this.requireLocation(projetoId, dto.paiId);
            await this.assertNoCycle(projetoId, localizacaoId, dto.paiId);
        }
        try {
            return await this.prisma.localizacao.update({
                where: { id: localizacaoId },
                data: {
                    ...(dto.nome === undefined ? {} : { nome: dto.nome.trim() }),
                    ...(dto.paiId === undefined ? {} : { paiId: dto.paiId }),
                },
            });
        }
        catch (error) {
            this.handleUnique(error);
            throw error;
        }
    }
    async assertNoCycle(projetoId, localizacaoId, novoPaiId) {
        let cursor = novoPaiId;
        const visited = new Set();
        while (cursor) {
            if (cursor === localizacaoId) {
                throw new common_1.BadRequestException('Não é possível mover uma localização para dentro de seus descendentes.');
            }
            if (visited.has(cursor)) {
                throw new common_1.BadRequestException('A árvore de localizações contém um ciclo.');
            }
            visited.add(cursor);
            const parent = await this.prisma.localizacao.findFirst({
                where: { id: cursor, projetoId },
                select: { paiId: true },
            });
            cursor = parent?.paiId ?? null;
        }
    }
    async requireLocation(projetoId, id) {
        const location = await this.prisma.localizacao.findFirst({
            where: { id, projetoId },
        });
        if (!location)
            throw new common_1.NotFoundException('Localização não encontrada.');
        return location;
    }
    buildTree(rows) {
        const nodes = new Map(rows.map((row) => [row.id, { ...row, filhos: [] }]));
        const roots = [];
        for (const node of nodes.values()) {
            const parent = node.paiId ? nodes.get(node.paiId) : undefined;
            if (parent)
                parent.filhos.push(node);
            else
                roots.push(node);
        }
        return roots;
    }
    assertCompany(user) {
        if (!user.empresaId)
            throw new common_1.NotFoundException('Empresa não encontrada.');
    }
    handleUnique(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException('Já existe uma localização com esse nome nesse nível.');
        }
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map