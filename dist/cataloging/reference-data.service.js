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
exports.ReferenceDataService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const authorization_service_1 = require("../auth/authorization.service");
const prisma_service_1 = require("../database/prisma.service");
let ReferenceDataService = class ReferenceDataService {
    prisma;
    authorization;
    constructor(prisma, authorization) {
        this.prisma = prisma;
        this.authorization = authorization;
    }
    companyId(user) {
        if (!user.empresaId || user.papel === client_1.PapelUsuario.ADMIN_GLOBAL)
            throw new common_1.NotFoundException('Empresa não encontrada.');
        return user.empresaId;
    }
    list(user, kind) {
        const where = { empresaId: this.companyId(user) };
        if (kind === 'categoria')
            return this.prisma.categoriaCatalogacao.findMany({
                where,
                orderBy: { nome: 'asc' },
            });
        if (kind === 'tag')
            return this.prisma.tag.findMany({ where, orderBy: { nome: 'asc' } });
        if (kind === 'local')
            return this.prisma.localAssinatura.findMany({
                where,
                orderBy: { nome: 'asc' },
            });
        return kind === 'forma'
            ? this.prisma.formaNegociacao.findMany({
                where,
                orderBy: { nome: 'asc' },
            })
            : this.prisma.modalidadeSeguro.findMany({
                where,
                orderBy: { nome: 'asc' },
            });
    }
    async create(user, kind, dto) {
        await this.authorization.assertCompanyEditor(user);
        const data = { empresaId: this.companyId(user), nome: dto.nome.trim() };
        try {
            if (kind === 'categoria')
                return await this.prisma.categoriaCatalogacao.create({ data });
            if (kind === 'tag')
                return await this.prisma.tag.create({
                    data: { ...data, cor: dto.cor ?? null },
                });
            if (kind === 'local')
                return await this.prisma.localAssinatura.create({ data });
            return kind === 'forma'
                ? await this.prisma.formaNegociacao.create({ data })
                : await this.prisma.modalidadeSeguro.create({ data });
        }
        catch (error) {
            this.unique(error);
            throw error;
        }
    }
    async update(user, kind, id, dto) {
        await this.authorization.assertCompanyEditor(user);
        const empresaId = this.companyId(user);
        const data = { nome: dto.nome.trim() };
        try {
            if (kind === 'categoria') {
                await this.require(this.prisma.categoriaCatalogacao.findFirst({
                    where: { id, empresaId },
                }));
                return await this.prisma.categoriaCatalogacao.update({
                    where: { id },
                    data,
                });
            }
            if (kind === 'tag') {
                await this.require(this.prisma.tag.findFirst({ where: { id, empresaId } }));
                return await this.prisma.tag.update({
                    where: { id },
                    data: { ...data, cor: dto.cor ?? null },
                });
            }
            if (kind === 'local') {
                await this.require(this.prisma.localAssinatura.findFirst({ where: { id, empresaId } }));
                return await this.prisma.localAssinatura.update({
                    where: { id },
                    data,
                });
            }
            if (kind === 'forma') {
                await this.require(this.prisma.formaNegociacao.findFirst({ where: { id, empresaId } }));
                return await this.prisma.formaNegociacao.update({
                    where: { id },
                    data,
                });
            }
            await this.require(this.prisma.modalidadeSeguro.findFirst({ where: { id, empresaId } }));
            return await this.prisma.modalidadeSeguro.update({ where: { id }, data });
        }
        catch (error) {
            this.unique(error);
            throw error;
        }
    }
    async require(value) {
        if (!(await value))
            throw new common_1.NotFoundException('Cadastro não encontrado.');
    }
    unique(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002')
            throw new common_1.ConflictException('Já existe um cadastro com esse nome na empresa.');
    }
};
exports.ReferenceDataService = ReferenceDataService;
exports.ReferenceDataService = ReferenceDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        authorization_service_1.AuthorizationService])
], ReferenceDataService);
//# sourceMappingURL=reference-data.service.js.map