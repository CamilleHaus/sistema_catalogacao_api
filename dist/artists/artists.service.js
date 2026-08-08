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
exports.ArtistsService = void 0;
const common_1 = require("@nestjs/common");
const authorization_service_1 = require("../auth/authorization.service");
const prisma_service_1 = require("../database/prisma.service");
let ArtistsService = class ArtistsService {
    prisma;
    authorization;
    constructor(prisma, authorization) {
        this.prisma = prisma;
        this.authorization = authorization;
    }
    list(user) {
        return this.prisma.artista.findMany({
            where: { empresaId: this.companyId(user) },
            orderBy: { nome: 'asc' },
        });
    }
    async findOne(user, id) {
        const item = await this.prisma.artista.findFirst({
            where: { id, empresaId: this.companyId(user) },
        });
        if (!item)
            throw new common_1.NotFoundException('Artista não encontrado.');
        return item;
    }
    async create(user, dto) {
        await this.authorization.assertCompanyEditor(user);
        return this.prisma.artista.create({
            data: {
                empresaId: this.companyId(user),
                ...this.data(dto),
                nome: dto.nome.trim(),
            },
        });
    }
    async update(user, id, dto) {
        await this.authorization.assertCompanyEditor(user);
        if (Object.values(dto).every((value) => value === undefined))
            throw new common_1.BadRequestException('Informe ao menos um campo para atualização.');
        await this.findOne(user, id);
        return this.prisma.artista.update({ where: { id }, data: this.data(dto) });
    }
    companyId(user) {
        if (!user.empresaId)
            throw new common_1.NotFoundException('Empresa não encontrada.');
        return user.empresaId;
    }
    data(dto) {
        return {
            ...(dto.nome === undefined ? {} : { nome: dto.nome.trim() }),
            ...(dto.localNascimento === undefined
                ? {}
                : { localNascimento: dto.localNascimento?.trim() || null }),
            ...(dto.anoNascimento === undefined
                ? {}
                : { anoNascimento: dto.anoNascimento }),
            ...(dto.localFalecimento === undefined
                ? {}
                : { localFalecimento: dto.localFalecimento?.trim() || null }),
            ...(dto.anoFalecimento === undefined
                ? {}
                : { anoFalecimento: dto.anoFalecimento }),
        };
    }
};
exports.ArtistsService = ArtistsService;
exports.ArtistsService = ArtistsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        authorization_service_1.AuthorizationService])
], ArtistsService);
//# sourceMappingURL=artists.service.js.map