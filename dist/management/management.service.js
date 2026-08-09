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
exports.ManagementService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
let ManagementService = class ManagementService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async auxiliaries(user) {
        const empresaId = this.company(user);
        const [estadosConservacao, tiposServico] = await Promise.all([
            this.prisma.estadoConservacao.findMany({
                where: { empresaId },
                orderBy: { nome: 'asc' },
            }),
            this.prisma.tipoServicoObra.findMany({
                where: { empresaId },
                orderBy: { nome: 'asc' },
            }),
        ]);
        return { estadosConservacao, tiposServico };
    }
    async createAux(user, kind, nome) {
        try {
            return await (kind === 'estado'
                ? this.prisma.estadoConservacao.create({
                    data: { empresaId: this.company(user), nome: nome.trim() },
                })
                : this.prisma.tipoServicoObra.create({
                    data: { empresaId: this.company(user), nome: nome.trim() },
                }));
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                e.code === 'P2002')
                throw new common_1.ConflictException('Já existe um auxiliar com esse nome.');
            throw e;
        }
    }
    async updateAux(user, kind, id, nome) {
        const empresaId = this.company(user);
        const model = kind === 'estado'
            ? this.prisma.estadoConservacao
            : this.prisma.tipoServicoObra;
        if (!(await model.findFirst({ where: { id, empresaId } })))
            throw new common_1.NotFoundException('Auxiliar não encontrado.');
        try {
            return await model.update({
                where: { id },
                data: { nome: nome.trim() },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                e.code === 'P2002')
                throw new common_1.ConflictException('Já existe um auxiliar com esse nome.');
            throw e;
        }
    }
    async get(p, w) {
        await this.work(p, w);
        const [analises, restauros, servicos, instrucoes, movimentacoes] = await Promise.all([
            this.prisma.analiseConservacao.findMany({
                where: { obraId: w },
                include: {
                    estadoConservacao: true,
                    imagens: { orderBy: { criadoEm: 'desc' } },
                },
                orderBy: [
                    { data: { sort: 'desc', nulls: 'last' } },
                    { criadoEm: 'desc' },
                ],
            }),
            this.prisma.restauroObra.findMany({
                where: { obraId: w },
                orderBy: { criadoEm: 'desc' },
            }),
            this.prisma.servicoObra.findMany({
                where: { obraId: w },
                include: { tipoServico: true },
                orderBy: { criadoEm: 'desc' },
            }),
            this.prisma.instrucaoObra.findMany({
                where: { obraId: w },
                include: { imagens: { orderBy: { criadoEm: 'desc' } } },
                orderBy: { criadoEm: 'desc' },
            }),
            this.prisma.movimentacaoObra.findMany({
                where: { obraId: w },
                orderBy: { criadoEm: 'desc' },
            }),
        ]);
        return { analises, restauros, servicos, instrucoes, movimentacoes };
    }
    async createAnalysis(p, w, d) {
        const c = await this.work(p, w);
        await this.aux(d.estadoConservacaoId, c.empresaId, 'estado');
        return this.prisma.analiseConservacao.create({
            data: { obraId: w, ...this.analysis(d) },
            include: { estadoConservacao: true, imagens: true },
        });
    }
    async updateAnalysis(p, w, id, d) {
        const c = await this.child(p, w, 'analise', id);
        await this.aux(d.estadoConservacaoId, c.empresaId, 'estado');
        return this.prisma.analiseConservacao.update({
            where: { id },
            data: this.analysis(d),
        });
    }
    async addAnalysisImage(p, w, id, d) {
        await this.child(p, w, 'analise', id);
        return this.prisma.imagemAnaliseConservacao.create({
            data: {
                analiseId: id,
                imagemUrl: d.imagemUrl.trim(),
                creditos: this.text(d.creditos),
                comentarios: this.text(d.comentarios),
            },
        });
    }
    async updateAnalysisImage(p, w, id, imageId, d) {
        await this.child(p, w, 'analise', id);
        const x = await this.prisma.imagemAnaliseConservacao.findFirst({
            where: { id: imageId, analiseId: id },
        });
        if (!x)
            throw new common_1.NotFoundException('Imagem não encontrada.');
        return this.prisma.imagemAnaliseConservacao.update({
            where: { id: imageId },
            data: {
                imagemUrl: d.imagemUrl.trim(),
                creditos: this.text(d.creditos),
                comentarios: this.text(d.comentarios),
            },
        });
    }
    async createRestoration(p, w, d) {
        await this.work(p, w);
        return this.prisma.restauroObra.create({
            data: { obraId: w, ...this.restoration(d) },
        });
    }
    async updateRestoration(p, w, id, d) {
        await this.child(p, w, 'restauro', id);
        return this.prisma.restauroObra.update({
            where: { id },
            data: this.restoration(d),
        });
    }
    async report(p, w, id, url) {
        await this.child(p, w, 'restauro', id);
        const ext = this.extension(url);
        if (!['pdf', 'doc', 'docx'].includes(ext))
            throw new common_1.BadRequestException('O relatório deve ser PDF, DOC ou DOCX.');
        return this.prisma.restauroObra.update({
            where: { id },
            data: { relatorioUrl: url.trim(), relatorioExtensao: ext },
        });
    }
    async createService(p, w, d) {
        const c = await this.work(p, w);
        await this.aux(d.tipoServicoId, c.empresaId, 'tipo');
        return this.prisma.servicoObra.create({
            data: { obraId: w, ...this.serviceData(d) },
            include: { tipoServico: true },
        });
    }
    async updateService(p, w, id, d) {
        const c = await this.child(p, w, 'servico', id);
        await this.aux(d.tipoServicoId, c.empresaId, 'tipo');
        return this.prisma.servicoObra.update({
            where: { id },
            data: this.serviceData(d),
        });
    }
    async createInstruction(p, w, d) {
        await this.work(p, w);
        return this.prisma.instrucaoObra.create({
            data: { obraId: w, ...this.instruction(d) },
            include: { imagens: true },
        });
    }
    async updateInstruction(p, w, id, d) {
        await this.child(p, w, 'instrucao', id);
        return this.prisma.instrucaoObra.update({
            where: { id },
            data: this.instruction(d),
        });
    }
    async addInstructionImage(p, w, id, url) {
        await this.child(p, w, 'instrucao', id);
        return this.prisma.imagemInstrucaoObra.create({
            data: { instrucaoId: id, imagemUrl: url.trim() },
        });
    }
    async createMovement(p, w, d) {
        return this.prisma.$transaction(async (tx) => {
            await this.work(p, w, tx);
            const [outPath, inPath] = await Promise.all([
                this.path(tx, p, d.localSaidaId),
                this.path(tx, p, d.localEntradaId),
            ]);
            const item = await tx.movimentacaoObra.create({
                data: {
                    obraId: w,
                    ...this.movement(d),
                    localSaidaSnapshot: outPath,
                    localEntradaSnapshot: inPath,
                },
            });
            if (d.localEntradaId)
                await tx.obra.update({
                    where: { id: w },
                    data: { localizacaoId: d.localEntradaId },
                });
            return item;
        }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
    }
    async updateMovement(p, w, id, d) {
        await this.child(p, w, 'movimentacao', id);
        const [a, b] = await Promise.all([
            this.path(this.prisma, p, d.localSaidaId),
            this.path(this.prisma, p, d.localEntradaId),
        ]);
        return this.prisma.movimentacaoObra.update({
            where: { id },
            data: {
                ...this.movement(d),
                localSaidaSnapshot: a,
                localEntradaSnapshot: b,
            },
        });
    }
    async remove(p, w, kind, id) {
        await this.child(p, w, kind, id);
        const model = {
            analise: this.prisma.analiseConservacao,
            restauro: this.prisma.restauroObra,
            servico: this.prisma.servicoObra,
            instrucao: this.prisma.instrucaoObra,
            movimentacao: this.prisma.movimentacaoObra,
        }[kind];
        return model.delete({ where: { id } });
    }
    async removeImage(p, w, kind, parent, id) {
        await this.child(p, w, kind, parent);
        const model = kind === 'analise'
            ? this.prisma.imagemAnaliseConservacao
            : this.prisma.imagemInstrucaoObra;
        const x = await model.findFirst({
            where: { id, [kind === 'analise' ? 'analiseId' : 'instrucaoId']: parent },
        });
        if (!x)
            throw new common_1.NotFoundException('Imagem não encontrada.');
        return model.delete({ where: { id } });
    }
    async removeReport(p, w, id) {
        await this.child(p, w, 'restauro', id);
        return this.prisma.restauroObra.update({
            where: { id },
            data: { relatorioUrl: null, relatorioExtensao: null },
        });
    }
    async work(p, w, db = this.prisma) {
        const x = await db.obra.findFirst({
            where: { id: w, projetoId: p },
            select: {
                id: true,
                localizacaoId: true,
                projeto: { select: { empresaId: true } },
            },
        });
        if (!x)
            throw new common_1.NotFoundException('Obra não encontrada.');
        return { ...x, empresaId: x.projeto.empresaId };
    }
    async child(p, w, k, id) {
        const c = await this.work(p, w);
        const m = {
            analise: this.prisma.analiseConservacao,
            restauro: this.prisma.restauroObra,
            servico: this.prisma.servicoObra,
            instrucao: this.prisma.instrucaoObra,
            movimentacao: this.prisma.movimentacaoObra,
        }[k];
        if (!m || !(await m.findFirst({ where: { id, obraId: w } })))
            throw new common_1.NotFoundException('Registro não encontrado.');
        return c;
    }
    async aux(id, e, k) {
        if (!id)
            return;
        const x = k === 'estado'
            ? await this.prisma.estadoConservacao.findFirst({
                where: { id, empresaId: e },
            })
            : await this.prisma.tipoServicoObra.findFirst({
                where: { id, empresaId: e },
            });
        if (!x)
            throw new common_1.BadRequestException('Auxiliar inválido para a empresa da obra.');
    }
    async path(db, p, id) {
        if (!id)
            return null;
        const names = [];
        const seen = new Set();
        let cursor = id;
        while (cursor) {
            if (seen.has(cursor))
                throw new common_1.BadRequestException('Ciclo na árvore de localizações.');
            seen.add(cursor);
            const x = await db.localizacao.findFirst({
                where: { id: cursor, projetoId: p },
                select: { nome: true, paiId: true },
            });
            if (!x)
                throw new common_1.BadRequestException('Localização inválida para este projeto.');
            names.unshift(x.nome);
            cursor = x.paiId;
        }
        return names.join(' > ');
    }
    analysis(d) {
        return {
            data: d.data ? new Date(`${d.data}T00:00:00.000Z`) : null,
            estadoConservacaoId: d.estadoConservacaoId || null,
            avaliador: this.text(d.avaliador),
            observacoes: this.text(d.observacoes),
        };
    }
    restoration(d) {
        return {
            dataEntrada: this.text(d.dataEntrada),
            dataSaida: this.text(d.dataSaida),
            localRestauro: this.text(d.localRestauro),
            motivo: this.text(d.motivo),
            observacoes: this.text(d.observacoes),
        };
    }
    serviceData(d) {
        return {
            data: this.text(d.data),
            tipoServicoId: d.tipoServicoId || null,
            local: this.text(d.local),
            observacoes: this.text(d.observacoes),
        };
    }
    instruction(d) {
        return {
            tipo: d.tipo ?? null,
            data: this.text(d.data),
            profissionalResponsavel: this.text(d.profissionalResponsavel),
            observacoes: this.text(d.observacoes),
        };
    }
    movement(d) {
        return {
            data: this.text(d.data),
            realizadoPor: this.text(d.realizadoPor),
            observacoes: this.text(d.observacoes),
            localSaidaId: d.localSaidaId || null,
            localEntradaId: d.localEntradaId || null,
        };
    }
    extension(url) {
        try {
            const p = new URL(url).pathname;
            return p.slice(p.lastIndexOf('.') + 1).toLowerCase();
        }
        catch {
            return '';
        }
    }
    text(v) {
        return v?.trim() || null;
    }
    company(u) {
        if (!u.empresaId)
            throw new common_1.NotFoundException('Empresa não encontrada.');
        return u.empresaId;
    }
};
exports.ManagementService = ManagementService;
exports.ManagementService = ManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ManagementService);
//# sourceMappingURL=management.service.js.map