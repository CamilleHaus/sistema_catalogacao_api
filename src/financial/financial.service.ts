import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import type {
  SaveDocumentDto,
  SaveEvaluationDto,
  SaveInsuranceDto,
  SaveTransactionDto,
} from './dto/financial.dto';
import { commissionValue, decimal, finalValue } from './money';

@Injectable()
export class FinancialService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly acquisitionInclude = {
    formaNegociacao: true,
    notasFiscais: { orderBy: { criadoEm: 'desc' as const } },
    comprovantes: { orderBy: { criadoEm: 'desc' as const } },
  };
  private readonly saleInclude = {
    formaNegociacao: true,
    comprovantes: { orderBy: { criadoEm: 'desc' as const } },
  };

  async get(projectId: string, workId: string) {
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

  async saveTransaction(
    projectId: string,
    workId: string,
    kind: 'aquisicao' | 'venda',
    dto: SaveTransactionDto,
    create: boolean,
  ) {
    const ctx = await this.context(projectId, workId);
    await this.validReference('forma', dto.formaNegociacaoId, ctx.empresaId);
    const existing = await (kind === 'aquisicao'
      ? this.prisma.aquisicao.findUnique({ where: { obraId: workId } })
      : this.prisma.venda.findUnique({ where: { obraId: workId } }));
    if (create && existing)
      throw new ConflictException(
        kind === 'aquisicao'
          ? 'A obra já possui aquisição.'
          : 'A obra já possui venda.',
      );
    if (!create && !existing)
      throw new NotFoundException('Registro financeiro não encontrado.');
    const valor =
      dto.valor === undefined ? (existing?.valor ?? null) : decimal(dto.valor);
    const desconto =
      dto.desconto === undefined
        ? (existing?.desconto ?? null)
        : decimal(dto.desconto);
    const tipo =
      dto.tipoDesconto === undefined
        ? (existing?.tipoDesconto ?? null)
        : dto.tipoDesconto;
    const valorFinal = finalValue(valor, tipo, desconto);
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
        const comissao =
          dto.comissao === undefined
            ? existing && 'comissao' in existing
              ? existing.comissao
              : null
            : decimal(dto.comissao);
        const tipoComissao =
          dto.tipoComissao === undefined
            ? existing && 'tipoComissao' in existing
              ? existing.tipoComissao
              : null
            : dto.tipoComissao;
        const acquisition = {
          ...data,
          tipoComissao,
          comissao,
          valorComissao: commissionValue(valorFinal, tipoComissao, comissao),
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException(
          'A obra já possui este registro financeiro.',
        );
      throw error;
    }
  }

  async removeTransaction(
    projectId: string,
    workId: string,
    kind: 'aquisicao' | 'venda',
  ) {
    await this.context(projectId, workId);
    const item =
      kind === 'aquisicao'
        ? await this.prisma.aquisicao.findUnique({ where: { obraId: workId } })
        : await this.prisma.venda.findUnique({ where: { obraId: workId } });
    if (!item)
      throw new NotFoundException('Registro financeiro não encontrado.');
    return kind === 'aquisicao'
      ? this.prisma.aquisicao.delete({ where: { obraId: workId } })
      : this.prisma.venda.delete({ where: { obraId: workId } });
  }

  async saveDocument(
    projectId: string,
    workId: string,
    kind: 'nota' | 'pagamento' | 'venda',
    dto: SaveDocumentDto,
    id?: string,
  ) {
    await this.context(projectId, workId);
    const parent =
      kind === 'venda'
        ? await this.prisma.venda.findUnique({ where: { obraId: workId } })
        : await this.prisma.aquisicao.findUnique({ where: { obraId: workId } });
    if (!parent)
      throw new BadRequestException(
        'Crie a operação antes de adicionar documentos.',
      );
    const data = {
      ...this.patchText(dto, 'imagemUrl'),
      ...(kind === 'nota' ? this.patchText(dto, 'numero') : {}),
      ...this.patch(dto, 'moeda'),
      ...this.patchText(dto, 'comentarios'),
      ...(dto.data === undefined ? {} : { data: this.date(dto.data) }),
      ...(dto.valor === undefined ? {} : { valor: decimal(dto.valor) }),
    };
    if (id) await this.requireDocument(kind, id, parent.id);
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
  async removeDocument(
    projectId: string,
    workId: string,
    kind: 'nota' | 'pagamento' | 'venda',
    id: string,
  ) {
    await this.context(projectId, workId);
    const parent =
      kind === 'venda'
        ? await this.prisma.venda.findUnique({ where: { obraId: workId } })
        : await this.prisma.aquisicao.findUnique({ where: { obraId: workId } });
    if (!parent) throw new NotFoundException('Operação não encontrada.');
    await this.requireDocument(kind, id, parent.id);
    return kind === 'nota'
      ? this.prisma.notaFiscalAquisicao.delete({ where: { id } })
      : kind === 'pagamento'
        ? this.prisma.comprovantePagamento.delete({ where: { id } })
        : this.prisma.comprovanteVenda.delete({ where: { id } });
  }

  async saveEvaluation(
    projectId: string,
    workId: string,
    dto: SaveEvaluationDto,
    id?: string,
  ) {
    await this.context(projectId, workId);
    if (id) await this.requireChild('avaliacao', id, workId);
    const data = {
      ...this.patch(dto, 'moeda'),
      ...this.patchText(dto, 'avaliador'),
      ...this.patchText(dto, 'comentarios'),
      ...(dto.data === undefined ? {} : { data: this.date(dto.data) }),
      ...(dto.valor === undefined ? {} : { valor: decimal(dto.valor) }),
    };
    return id
      ? this.prisma.avaliacaoFinanceira.update({ where: { id }, data })
      : this.prisma.avaliacaoFinanceira.create({
          data: { obraId: workId, ...data },
        });
  }
  async saveInsurance(
    projectId: string,
    workId: string,
    dto: SaveInsuranceDto,
    id?: string,
  ) {
    const ctx = await this.context(projectId, workId);
    if (id) await this.requireChild('seguro', id, workId);
    await this.validReference(
      'modalidade',
      dto.modalidadeSeguroId,
      ctx.empresaId,
    );
    const data = {
      ...this.patchText(dto, 'vigencia'),
      ...this.patch(dto, 'moeda'),
      ...(dto.valor === undefined ? {} : { valor: decimal(dto.valor) }),
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
  async removeChild(
    projectId: string,
    workId: string,
    kind: 'avaliacao' | 'seguro',
    id: string,
  ) {
    await this.context(projectId, workId);
    await this.requireChild(kind, id, workId);
    return kind === 'avaliacao'
      ? this.prisma.avaliacaoFinanceira.delete({ where: { id } })
      : this.prisma.seguroObra.delete({ where: { id } });
  }

  private async context(projectId: string, workId: string) {
    const work = await this.prisma.obra.findFirst({
      where: { id: workId, projetoId: projectId },
      select: { projeto: { select: { empresaId: true } } },
    });
    if (!work) throw new NotFoundException('Obra não encontrada.');
    return work.projeto;
  }
  private async validReference(
    kind: 'forma' | 'modalidade',
    id: string | null | undefined,
    empresaId: string,
  ) {
    if (!id) return;
    const found =
      kind === 'forma'
        ? await this.prisma.formaNegociacao.findFirst({
            where: { id, empresaId },
          })
        : await this.prisma.modalidadeSeguro.findFirst({
            where: { id, empresaId },
          });
    if (!found)
      throw new BadRequestException(
        'Cadastro auxiliar inválido para a empresa da obra.',
      );
  }
  private async requireDocument(
    kind: 'nota' | 'pagamento' | 'venda',
    id: string,
    parentId: string,
  ) {
    const found =
      kind === 'nota'
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
    if (!found) throw new NotFoundException('Documento não encontrado.');
  }
  private async requireChild(
    kind: 'avaliacao' | 'seguro',
    id: string,
    workId: string,
  ) {
    const found =
      kind === 'avaliacao'
        ? await this.prisma.avaliacaoFinanceira.findFirst({
            where: { id, obraId: workId },
          })
        : await this.prisma.seguroObra.findFirst({
            where: { id, obraId: workId },
          });
    if (!found) throw new NotFoundException('Registro não encontrado.');
  }
  private patch<T extends object, K extends keyof T>(dto: T, key: K) {
    return dto[key] === undefined ? {} : { [key]: dto[key] ?? null };
  }
  private patchText<T extends object, K extends keyof T>(
    dto: T,
    key: K,
    output: string = key as string,
  ) {
    const value = dto[key] as string | null | undefined;
    return value === undefined ? {} : { [output]: value?.trim() || null };
  }
  private date(value?: string | null) {
    return value ? new Date(`${value}T00:00:00.000Z`) : null;
  }
}
