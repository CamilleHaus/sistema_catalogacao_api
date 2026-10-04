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
exports.FinancialService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
const money_1 = require("./money");
let FinancialService = class FinancialService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    acquisitionInclude = {
        formaNegociacao: true,
        notasFiscais: { orderBy: { criadoEm: 'desc' } },
        comprovantes: { orderBy: { criadoEm: 'desc' } },
    };
    saleInclude = {
        formaNegociacao: true,
        comprovantes: { orderBy: { criadoEm: 'desc' } },
    };
    async get(projectId, workId) {
        await this.context(projectId, workId);
        const [aquisicao, venda, avaliacoes, seguros] = await Promise.all([
            this.prisma.aquisicao.findUnique({
                where: { obraId: workId },
                include: this.acquisitionInclude,
            }),
            this.prisma.venda.findUnique({
                where: { obraId: workId },
                include: this.saleInclude,
            }),
            this.prisma.avaliacaoFinanceira.findMany({
                where: { obraId: workId },
                orderBy: [
                    { data: { sort: 'desc', nulls: 'last' } },
                    { criadoEm: 'desc' },
                ],
            }),
            this.prisma.seguroObra.findMany({
                where: { obraId: workId },
                include: { modalidadeSeguro: true },
                orderBy: { criadoEm: 'desc' },
            }),
        ]);
        return { aquisicao, venda, avaliacoes, seguros };
    }
    async saveTransaction(projectId, workId, kind, dto, create) {
        const ctx = await this.context(projectId, workId);
        await this.validReference('forma', dto.formaNegociacaoId, ctx.empresaId);
        const existing = await (kind === 'aquisicao'
            ? this.prisma.aquisicao.findUnique({ where: { obraId: workId } })
            : this.prisma.venda.findUnique({ where: { obraId: workId } }));
        if (create && existing)
            throw new common_1.ConflictException(kind === 'aquisicao'
                ? 'A obra já possui aquisição.'
                : 'A obra já possui venda.');
        if (!create && !existing)
            throw new common_1.NotFoundException('Registro financeiro não encontrado.');
        const valor = dto.valor === undefined ? (existing?.valor ?? null) : (0, money_1.decimal)(dto.valor);
        const desconto = dto.desconto === undefined
            ? (existing?.desconto ?? null)
            : (0, money_1.decimal)(dto.desconto);
        const tipo = dto.tipoDesconto === undefined
            ? (existing?.tipoDesconto ?? null)
            : dto.tipoDesconto;
        const valorFinal = (0, money_1.finalValue)(valor, tipo, desconto);
        const data = {
            obraId: workId,
            ...this.patch(dto, 'formaNegociacaoId'),
            ...this.patchText(dto, 'data'),
            ...(kind === 'aquisicao'
                ? { ...this.patchText(dto, 'contraparte', 'adquiridoDe') }
                : { ...this.patchText(dto, 'contraparte', 'vendidoPara') }),
            ...this.patch(dto, 'moeda'),
            valor,
            tipoDesconto: tipo,
            desconto,
            valorFinal,
        };
        try {
            if (kind === 'aquisicao') {
                const comissao = dto.comissao === undefined
                    ? existing && 'comissao' in existing
                        ? existing.comissao
                        : null
                    : (0, money_1.decimal)(dto.comissao);
                const tipoComissao = dto.tipoComissao === undefined
                    ? existing && 'tipoComissao' in existing
                        ? existing.tipoComissao
                        : null
                    : dto.tipoComissao;
                const acquisition = {
                    ...data,
                    tipoComissao,
                    comissao,
                    valorComissao: (0, money_1.commissionValue)(valorFinal, tipoComissao, comissao),
                };
                return create
                    ? this.prisma.aquisicao.create({
                        data: acquisition,
                        include: this.acquisitionInclude,
                    })
                    : this.prisma.aquisicao.update({
                        where: { obraId: workId },
                        data: acquisition,
                        include: this.acquisitionInclude,
                    });
            }
            return create
                ? this.prisma.venda.create({ data, include: this.saleInclude })
                : this.prisma.venda.update({
                    where: { obraId: workId },
                    data,
                    include: this.saleInclude,
                });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002')
                throw new common_1.ConflictException('A obra já possui este registro financeiro.');
            throw error;
        }
    }
    async removeTransaction(projectId, workId, kind) {
        await this.context(projectId, workId);
        const item = kind === 'aquisicao'
            ? await this.prisma.aquisicao.findUnique({ where: { obraId: workId } })
            : await this.prisma.venda.findUnique({ where: { obraId: workId } });
        if (!item)
            throw new common_1.NotFoundException('Registro financeiro não encontrado.');
        return kind === 'aquisicao'
            ? this.prisma.aquisicao.delete({ where: { obraId: workId } })
            : this.prisma.venda.delete({ where: { obraId: workId } });
    }
    async saveDocument(projectId, workId, kind, dto, id) {
        await this.context(projectId, workId);
        const parent = kind === 'venda'
            ? await this.prisma.venda.findUnique({ where: { obraId: workId } })
            : await this.prisma.aquisicao.findUnique({ where: { obraId: workId } });
        if (!parent)
            throw new common_1.BadRequestException('Crie a operação antes de adicionar documentos.');
        const data = {
            ...this.patchText(dto, 'imagemUrl'),
            ...(kind === 'nota' ? this.patchText(dto, 'numero') : {}),
            ...this.patch(dto, 'moeda'),
            ...this.patchText(dto, 'comentarios'),
            ...(dto.data === undefined ? {} : { data: this.date(dto.data) }),
            ...(dto.valor === undefined ? {} : { valor: (0, money_1.decimal)(dto.valor) }),
        };
        if (id)
            await this.requireDocument(kind, id, parent.id);
        if (kind === 'nota')
            return id
                ? this.prisma.notaFiscalAquisicao.update({ where: { id }, data })
                : this.prisma.notaFiscalAquisicao.create({
                    data: { aquisicaoId: parent.id, ...data },
                });
        if (kind === 'pagamento')
            return id
                ? this.prisma.comprovantePagamento.update({ where: { id }, data })
                : this.prisma.comprovantePagamento.create({
                    data: { aquisicaoId: parent.id, ...data },
                });
        return id
            ? this.prisma.comprovanteVenda.update({ where: { id }, data })
            : this.prisma.comprovanteVenda.create({
                data: { vendaId: parent.id, ...data },
            });
    }
    async removeDocument(projectId, workId, kind, id) {
        await this.context(projectId, workId);
        const parent = kind === 'venda'
            ? await this.prisma.venda.findUnique({ where: { obraId: workId } })
            : await this.prisma.aquisicao.findUnique({ where: { obraId: workId } });
        if (!parent)
            throw new common_1.NotFoundException('Operação não encontrada.');
        await this.requireDocument(kind, id, parent.id);
        return kind === 'nota'
            ? this.prisma.notaFiscalAquisicao.delete({ where: { id } })
            : kind === 'pagamento'
                ? this.prisma.comprovantePagamento.delete({ where: { id } })
                : this.prisma.comprovanteVenda.delete({ where: { id } });
    }
    async saveEvaluation(projectId, workId, dto, id) {
        await this.context(projectId, workId);
        if (id)
            await this.requireChild('avaliacao', id, workId);
        const data = {
            ...this.patch(dto, 'moeda'),
            ...this.patchText(dto, 'avaliador'),
            ...this.patchText(dto, 'comentarios'),
            ...(dto.data === undefined ? {} : { data: this.date(dto.data) }),
            ...(dto.valor === undefined ? {} : { valor: (0, money_1.decimal)(dto.valor) }),
        };
        return id
            ? this.prisma.avaliacaoFinanceira.update({ where: { id }, data })
            : this.prisma.avaliacaoFinanceira.create({
                data: { obraId: workId, ...data },
            });
    }
    async saveInsurance(projectId, workId, dto, id) {
        const ctx = await this.context(projectId, workId);
        if (id)
            await this.requireChild('seguro', id, workId);
        await this.validReference('modalidade', dto.modalidadeSeguroId, ctx.empresaId);
        const data = {
            ...this.patchText(dto, 'vigencia'),
            ...this.patch(dto, 'moeda'),
            ...(dto.valor === undefined ? {} : { valor: (0, money_1.decimal)(dto.valor) }),
            ...this.patch(dto, 'modalidadeSeguroId'),
            ...this.patchText(dto, 'observacoes'),
        };
        return id
            ? this.prisma.seguroObra.update({
                where: { id },
                data,
                include: { modalidadeSeguro: true },
            })
            : this.prisma.seguroObra.create({
                data: { obraId: workId, ...data },
                include: { modalidadeSeguro: true },
            });
    }
    async removeChild(projectId, workId, kind, id) {
        await this.context(projectId, workId);
        await this.requireChild(kind, id, workId);
        return kind === 'avaliacao'
            ? this.prisma.avaliacaoFinanceira.delete({ where: { id } })
            : this.prisma.seguroObra.delete({ where: { id } });
    }
    async context(projectId, workId) {
        const work = await this.prisma.obra.findFirst({
            where: { id: workId, projetoId: projectId },
            select: { projeto: { select: { empresaId: true } } },
        });
        if (!work)
            throw new common_1.NotFoundException('Obra não encontrada.');
        return work.projeto;
    }
    async validReference(kind, id, empresaId) {
        if (!id)
            return;
        const found = kind === 'forma'
            ? await this.prisma.formaNegociacao.findFirst({
                where: { id, empresaId },
            })
            : await this.prisma.modalidadeSeguro.findFirst({
                where: { id, empresaId },
            });
        if (!found)
            throw new common_1.BadRequestException('Cadastro auxiliar inválido para a empresa da obra.');
    }
    async requireDocument(kind, id, parentId) {
        const found = kind === 'nota'
            ? await this.prisma.notaFiscalAquisicao.findFirst({
                where: { id, aquisicaoId: parentId },
            })
            : kind === 'pagamento'
                ? await this.prisma.comprovantePagamento.findFirst({
                    where: { id, aquisicaoId: parentId },
                })
                : await this.prisma.comprovanteVenda.findFirst({
                    where: { id, vendaId: parentId },
                });
        if (!found)
            throw new common_1.NotFoundException('Documento não encontrado.');
    }
    async requireChild(kind, id, workId) {
        const found = kind === 'avaliacao'
            ? await this.prisma.avaliacaoFinanceira.findFirst({
                where: { id, obraId: workId },
            })
            : await this.prisma.seguroObra.findFirst({
                where: { id, obraId: workId },
            });
        if (!found)
            throw new common_1.NotFoundException('Registro não encontrado.');
    }
    patch(dto, key) {
        return dto[key] === undefined ? {} : { [key]: dto[key] ?? null };
    }
    patchText(dto, key, output = key) {
        const value = dto[key];
        return value === undefined ? {} : { [output]: value?.trim() || null };
    }
    date(value) {
        return value ? new Date(`${value}T00:00:00.000Z`) : null;
    }
};
exports.FinancialService = FinancialService;
exports.FinancialService = FinancialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinancialService);
//# sourceMappingURL=financial.service.js.map