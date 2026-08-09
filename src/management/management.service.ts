import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
import { Prisma } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';
import type {
  AnalysisDto,
  AnalysisImageDto,
  InstructionDto,
  MovementDto,
  RestorationDto,
  ServiceDto,
} from './dto/management.dto';

@Injectable()
export class ManagementService {
  constructor(private readonly prisma: PrismaService) {}
  async auxiliaries(user: AuthenticatedUser) {
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
  async createAux(
    user: AuthenticatedUser,
    kind: 'estado' | 'tipo',
    nome: string,
  ) {
    try {
      return await (kind === 'estado'
        ? this.prisma.estadoConservacao.create({
            data: { empresaId: this.company(user), nome: nome.trim() },
          })
        : this.prisma.tipoServicoObra.create({
            data: { empresaId: this.company(user), nome: nome.trim() },
          }));
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      )
        throw new ConflictException('Já existe um auxiliar com esse nome.');
      throw e;
    }
  }
  async updateAux(
    user: AuthenticatedUser,
    kind: 'estado' | 'tipo',
    id: string,
    nome: string,
  ) {
    const empresaId = this.company(user);
    const model =
      kind === 'estado'
        ? this.prisma.estadoConservacao
        : this.prisma.tipoServicoObra;
    if (!(await (model as any).findFirst({ where: { id, empresaId } })))
      throw new NotFoundException('Auxiliar não encontrado.');
    try {
      return await (model as any).update({
        where: { id },
        data: { nome: nome.trim() },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      )
        throw new ConflictException('Já existe um auxiliar com esse nome.');
      throw e;
    }
  }
  async get(p: string, w: string) {
    await this.work(p, w);
    const [analises, restauros, servicos, instrucoes, movimentacoes] =
      await Promise.all([
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
  async createAnalysis(p: string, w: string, d: AnalysisDto) {
    const c = await this.work(p, w);
    await this.aux(d.estadoConservacaoId, c.empresaId, 'estado');
    return this.prisma.analiseConservacao.create({
      data: { obraId: w, ...this.analysis(d) },
      include: { estadoConservacao: true, imagens: true },
    });
  }
  async updateAnalysis(p: string, w: string, id: string, d: AnalysisDto) {
    const c = await this.child(p, w, 'analise', id);
    await this.aux(d.estadoConservacaoId, c.empresaId, 'estado');
    return this.prisma.analiseConservacao.update({
      where: { id },
      data: this.analysis(d),
    });
  }
  async addAnalysisImage(
    p: string,
    w: string,
    id: string,
    d: AnalysisImageDto,
  ) {
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
  async updateAnalysisImage(
    p: string,
    w: string,
    id: string,
    imageId: string,
    d: AnalysisImageDto,
  ) {
    await this.child(p, w, 'analise', id);
    const x = await this.prisma.imagemAnaliseConservacao.findFirst({
      where: { id: imageId, analiseId: id },
    });
    if (!x) throw new NotFoundException('Imagem não encontrada.');
    return this.prisma.imagemAnaliseConservacao.update({
      where: { id: imageId },
      data: {
        imagemUrl: d.imagemUrl.trim(),
        creditos: this.text(d.creditos),
        comentarios: this.text(d.comentarios),
      },
    });
  }
  async createRestoration(p: string, w: string, d: RestorationDto) {
    await this.work(p, w);
    return this.prisma.restauroObra.create({
      data: { obraId: w, ...this.restoration(d) },
    });
  }
  async updateRestoration(p: string, w: string, id: string, d: RestorationDto) {
    await this.child(p, w, 'restauro', id);
    return this.prisma.restauroObra.update({
      where: { id },
      data: this.restoration(d),
    });
  }
  async report(p: string, w: string, id: string, url: string) {
    await this.child(p, w, 'restauro', id);
    const ext = this.extension(url);
    if (!['pdf', 'doc', 'docx'].includes(ext))
      throw new BadRequestException('O relatório deve ser PDF, DOC ou DOCX.');
    return this.prisma.restauroObra.update({
      where: { id },
      data: { relatorioUrl: url.trim(), relatorioExtensao: ext },
    });
  }
  async createService(p: string, w: string, d: ServiceDto) {
    const c = await this.work(p, w);
    await this.aux(d.tipoServicoId, c.empresaId, 'tipo');
    return this.prisma.servicoObra.create({
      data: { obraId: w, ...this.serviceData(d) },
      include: { tipoServico: true },
    });
  }
  async updateService(p: string, w: string, id: string, d: ServiceDto) {
    const c = await this.child(p, w, 'servico', id);
    await this.aux(d.tipoServicoId, c.empresaId, 'tipo');
    return this.prisma.servicoObra.update({
      where: { id },
      data: this.serviceData(d),
    });
  }
  async createInstruction(p: string, w: string, d: InstructionDto) {
    await this.work(p, w);
    return this.prisma.instrucaoObra.create({
      data: { obraId: w, ...this.instruction(d) },
      include: { imagens: true },
    });
  }
  async updateInstruction(p: string, w: string, id: string, d: InstructionDto) {
    await this.child(p, w, 'instrucao', id);
    return this.prisma.instrucaoObra.update({
      where: { id },
      data: this.instruction(d),
    });
  }
  async addInstructionImage(p: string, w: string, id: string, url: string) {
    await this.child(p, w, 'instrucao', id);
    return this.prisma.imagemInstrucaoObra.create({
      data: { instrucaoId: id, imagemUrl: url.trim() },
    });
  }
  async createMovement(p: string, w: string, d: MovementDto) {
    return this.prisma.$transaction(
      async (tx) => {
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
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }
  async updateMovement(p: string, w: string, id: string, d: MovementDto) {
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
  async remove(p: string, w: string, kind: string, id: string) {
    await this.child(p, w, kind, id);
    const model: any = (
      {
        analise: this.prisma.analiseConservacao,
        restauro: this.prisma.restauroObra,
        servico: this.prisma.servicoObra,
        instrucao: this.prisma.instrucaoObra,
        movimentacao: this.prisma.movimentacaoObra,
      } as any
    )[kind];
    return model.delete({ where: { id } });
  }
  async removeImage(
    p: string,
    w: string,
    kind: 'analise' | 'instrucao',
    parent: string,
    id: string,
  ) {
    await this.child(p, w, kind, parent);
    const model =
      kind === 'analise'
        ? this.prisma.imagemAnaliseConservacao
        : this.prisma.imagemInstrucaoObra;
    const x = await (model as any).findFirst({
      where: { id, [kind === 'analise' ? 'analiseId' : 'instrucaoId']: parent },
    });
    if (!x) throw new NotFoundException('Imagem não encontrada.');
    return (model as any).delete({ where: { id } });
  }
  async removeReport(p: string, w: string, id: string) {
    await this.child(p, w, 'restauro', id);
    return this.prisma.restauroObra.update({
      where: { id },
      data: { relatorioUrl: null, relatorioExtensao: null },
    });
  }
  private async work(p: string, w: string, db: any = this.prisma) {
    const x = await db.obra.findFirst({
      where: { id: w, projetoId: p },
      select: {
        id: true,
        localizacaoId: true,
        projeto: { select: { empresaId: true } },
      },
    });
    if (!x) throw new NotFoundException('Obra não encontrada.');
    return { ...x, empresaId: x.projeto.empresaId };
  }
  private async child(p: string, w: string, k: string, id: string) {
    const c = await this.work(p, w);
    const m: any = (
      {
        analise: this.prisma.analiseConservacao,
        restauro: this.prisma.restauroObra,
        servico: this.prisma.servicoObra,
        instrucao: this.prisma.instrucaoObra,
        movimentacao: this.prisma.movimentacaoObra,
      } as any
    )[k];
    if (!m || !(await m.findFirst({ where: { id, obraId: w } })))
      throw new NotFoundException('Registro não encontrado.');
    return c;
  }
  private async aux(
    id: string | null | undefined,
    e: string,
    k: 'estado' | 'tipo',
  ) {
    if (!id) return;
    const x =
      k === 'estado'
        ? await this.prisma.estadoConservacao.findFirst({
            where: { id, empresaId: e },
          })
        : await this.prisma.tipoServicoObra.findFirst({
            where: { id, empresaId: e },
          });
    if (!x)
      throw new BadRequestException(
        'Auxiliar inválido para a empresa da obra.',
      );
  }
  private async path(db: any, p: string, id?: string | null) {
    if (!id) return null;
    const names: string[] = [];
    const seen = new Set<string>();
    let cursor: string | null = id;
    while (cursor) {
      if (seen.has(cursor))
        throw new BadRequestException('Ciclo na árvore de localizações.');
      seen.add(cursor);
      const x: { nome: string; paiId: string | null } | null =
        await db.localizacao.findFirst({
          where: { id: cursor, projetoId: p },
          select: { nome: true, paiId: true },
        });
      if (!x)
        throw new BadRequestException(
          'Localização inválida para este projeto.',
        );
      names.unshift(x.nome);
      cursor = x.paiId;
    }
    return names.join(' > ');
  }
  private analysis(d: AnalysisDto) {
    return {
      data: d.data ? new Date(`${d.data}T00:00:00.000Z`) : null,
      estadoConservacaoId: d.estadoConservacaoId || null,
      avaliador: this.text(d.avaliador),
      observacoes: this.text(d.observacoes),
    };
  }
  private restoration(d: RestorationDto) {
    return {
      dataEntrada: this.text(d.dataEntrada),
      dataSaida: this.text(d.dataSaida),
      localRestauro: this.text(d.localRestauro),
      motivo: this.text(d.motivo),
      observacoes: this.text(d.observacoes),
    };
  }
  private serviceData(d: ServiceDto) {
    return {
      data: this.text(d.data),
      tipoServicoId: d.tipoServicoId || null,
      local: this.text(d.local),
      observacoes: this.text(d.observacoes),
    };
  }
  private instruction(d: InstructionDto) {
    return {
      tipo: d.tipo ?? null,
      data: this.text(d.data),
      profissionalResponsavel: this.text(d.profissionalResponsavel),
      observacoes: this.text(d.observacoes),
    };
  }
  private movement(d: MovementDto) {
    return {
      data: this.text(d.data),
      realizadoPor: this.text(d.realizadoPor),
      observacoes: this.text(d.observacoes),
      localSaidaId: d.localSaidaId || null,
      localEntradaId: d.localEntradaId || null,
    };
  }
  private extension(url: string) {
    try {
      const p = new URL(url).pathname;
      return p.slice(p.lastIndexOf('.') + 1).toLowerCase();
    } catch {
      return '';
    }
  }
  private text(v?: string | null) {
    return v?.trim() || null;
  }
  private company(u: AuthenticatedUser) {
    if (!u.empresaId) throw new NotFoundException('Empresa não encontrada.');
    return u.empresaId;
  }
}
