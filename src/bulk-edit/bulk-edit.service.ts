import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AdvancedSearchService } from '../advanced-search/advanced-search.service';
import { PrismaService } from '../database/prisma.service';
import type { BulkEditDto } from './bulk-edit.dto';
import { BULK_FIELDS, BULK_FIELDS_BY_ID, type BulkField } from './bulk-fields';

type Tx = Prisma.TransactionClient;

export interface BulkResult {
  /** Obras que receberam a alteração. */
  atualizadas: number;
  /** Obras sem aquisição/venda: não há registro onde gravar o campo. */
  ignoradas: number;
  movimentacoes: number;
}

@Injectable()
export class BulkEditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly search: AdvancedSearchService,
  ) {}

  async fields(projetoId: string) {
    const options = await this.search.optionSources(projetoId);
    return BULK_FIELDS.map((field) => ({
      id: field.id,
      label: field.label,
      grupo: field.group,
      tipo: field.kind,
      ...(field.source || field.enumOptions
        ? { opcoes: field.source ? options[field.source] : field.enumOptions }
        : {}),
    }));
  }

  async apply(projetoId: string, dto: BulkEditDto): Promise<BulkResult> {
    const field = BULK_FIELDS_BY_ID.get(dto.campo);
    if (!field)
      throw new BadRequestException('Campo inválido para edição em massa.');
    const value = await this.validate(projetoId, field, dto);
    const obraIds = [...new Set(dto.obraIds)];

    return this.prisma.$transaction(
      async (tx) => {
        const found = await tx.obra.count({
          where: { id: { in: obraIds }, projetoId },
        });
        if (found !== obraIds.length)
          throw new BadRequestException(
            'Uma ou mais obras não pertencem a este projeto.',
          );

        if (field.kind === 'lista')
          return this.applyList(
            tx,
            field,
            obraIds,
            value as string[],
            dto.modo!,
          );
        if (field.target === 'obra')
          return this.applyWork(tx, projetoId, field, obraIds, value, dto);
        if (field.target === 'catalogacao')
          return this.applyCatalog(tx, field, obraIds, value);
        return this.applyTransaction(tx, field, obraIds, value);
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 30_000,
      },
    );
  }

  /** Normaliza o valor e confere que a opção existe para este projeto. */
  private async validate(
    projetoId: string,
    field: BulkField,
    dto: BulkEditDto,
  ) {
    const raw = dto.valor;
    if (field.kind === 'lista') {
      if (!dto.modo)
        throw new BadRequestException(
          'Escolha se vai adicionar, remover ou substituir.',
        );
      if (!Array.isArray(raw) || !raw.every((item) => typeof item === 'string'))
        throw new BadRequestException(`Escolha os itens de "${field.label}".`);
      if (raw.length === 0 && dto.modo !== 'substituir')
        throw new BadRequestException(
          `Escolha ao menos um item de "${field.label}".`,
        );
      await this.assertOptions(projetoId, field, raw);
      return raw;
    }
    if (raw === null || raw === undefined || raw === '') return null;

    if (field.kind === 'texto') {
      if (typeof raw !== 'string')
        throw new BadRequestException(`Texto inválido em "${field.label}".`);
      const text = raw.trim();
      if (text.length > 500)
        throw new BadRequestException(
          `Texto longo demais em "${field.label}".`,
        );
      return text || null;
    }
    if (field.kind === 'inteiro') {
      const number = typeof raw === 'number' ? raw : Number(raw);
      if (!Number.isInteger(number) || number < 2 || number > 9999)
        throw new BadRequestException(
          `"${field.label}" deve ser um número inteiro entre 2 e 9999.`,
        );
      return number;
    }
    if (typeof raw !== 'string')
      throw new BadRequestException(`Opção inválida em "${field.label}".`);
    await this.assertOptions(projetoId, field, [raw]);
    return raw;
  }

  private async assertOptions(
    projetoId: string,
    field: BulkField,
    values: string[],
  ) {
    const allowed = field.source
      ? (await this.search.optionSources(projetoId))[field.source]
      : (field.enumOptions ?? []);
    const ids = new Set(allowed.map((option) => option.value));
    if (!values.every((value) => ids.has(value)))
      throw new BadRequestException(
        `Opção inválida em "${field.label}" para este projeto.`,
      );
  }

  private async applyWork(
    tx: Tx,
    projetoId: string,
    field: BulkField,
    obraIds: string[],
    value: unknown,
    dto: BulkEditDto,
  ): Promise<BulkResult> {
    // Os mesmos pares que a edição de uma obra grava juntos.
    const data =
      field.id === 'quantidadePartes'
        ? {
            grupoObra: value !== null,
            quantidadePartes: value as number | null,
          }
        : field.id === 'tituloSerie'
          ? { serie: value !== null, tituloSerie: value as string | null }
          : { [field.column]: value };

    let movimentacoes = 0;
    if (field.id === 'localizacao' && dto.movimentacao?.registrar) {
      // Filtra no código: um NOT do SQL descartaria as obras sem localização.
      const moving = (
        await tx.obra.findMany({
          where: { id: { in: obraIds } },
          select: { id: true, localizacaoId: true },
        })
      ).filter((work) => work.localizacaoId !== value);
      if (moving.length > 0) {
        const path = await this.locationPaths(tx, projetoId);
        const text = (raw?: string | null) => raw?.trim() || null;
        const movement = dto.movimentacao;
        movimentacoes = (
          await tx.movimentacaoObra.createMany({
            data: moving.map((work) => ({
              obraId: work.id,
              data: text(movement.data),
              realizadoPor: text(movement.realizadoPor),
              observacoes: text(movement.observacoes),
              localSaidaId: work.localizacaoId,
              localSaidaSnapshot: path(work.localizacaoId),
              localEntradaId: value as string | null,
              localEntradaSnapshot: path(value as string | null),
            })),
          })
        ).count;
      }
    }

    const { count } = await tx.obra.updateMany({
      where: { id: { in: obraIds } },
      data,
    });
    return { atualizadas: count, ignoradas: 0, movimentacoes };
  }

  /** A catalogação é criada quando falta, salvo se o valor é só para limpar. */
  private async applyCatalog(
    tx: Tx,
    field: BulkField,
    obraIds: string[],
    value: unknown,
  ) {
    if (value !== null) await this.ensureCatalogs(tx, obraIds);
    const { count } = await tx.catalogacao.updateMany({
      where: { obraId: { in: obraIds } },
      data: { [field.column]: value },
    });
    return {
      atualizadas: value === null ? obraIds.length : count,
      ignoradas: 0,
      movimentacoes: 0,
    };
  }

  /** Aquisição e venda só são alteradas onde já existem; as demais são contadas. */
  private async applyTransaction(
    tx: Tx,
    field: BulkField,
    obraIds: string[],
    value: unknown,
  ) {
    const where = { obraId: { in: obraIds } };
    const data = { [field.column]: value };
    const { count } =
      field.target === 'aquisicao'
        ? await tx.aquisicao.updateMany({ where, data })
        : await tx.venda.updateMany({ where, data });
    return {
      atualizadas: count,
      ignoradas: obraIds.length - count,
      movimentacoes: 0,
    };
  }

  private async applyList(
    tx: Tx,
    field: BulkField,
    obraIds: string[],
    ids: string[],
    modo: 'adicionar' | 'remover' | 'substituir',
  ): Promise<BulkResult> {
    const result = {
      atualizadas: obraIds.length,
      ignoradas: 0,
      movimentacoes: 0,
    };

    if (field.id === 'artistas') {
      if (modo !== 'adicionar')
        await tx.obraArtista.deleteMany({
          where: {
            obraId: { in: obraIds },
            ...(modo === 'remover' ? { artistaId: { in: ids } } : {}),
          },
        });
      if (modo !== 'remover' && ids.length > 0)
        await tx.obraArtista.createMany({
          data: obraIds.flatMap((obraId) =>
            ids.map((artistaId) => ({ obraId, artistaId })),
          ),
          skipDuplicates: true,
        });
      return result;
    }

    // Tags vivem na catalogação: cria a que falta antes de vincular.
    if (modo !== 'remover' && ids.length > 0)
      await this.ensureCatalogs(tx, obraIds);
    const catalogs = await tx.catalogacao.findMany({
      where: { obraId: { in: obraIds } },
      select: { id: true },
    });
    const catalogIds = catalogs.map((catalog) => catalog.id);
    if (modo !== 'adicionar')
      await tx.catalogacaoTag.deleteMany({
        where: {
          catalogacaoId: { in: catalogIds },
          ...(modo === 'remover' ? { tagId: { in: ids } } : {}),
        },
      });
    if (modo !== 'remover' && ids.length > 0)
      await tx.catalogacaoTag.createMany({
        data: catalogIds.flatMap((catalogacaoId) =>
          ids.map((tagId) => ({ catalogacaoId, tagId })),
        ),
        skipDuplicates: true,
      });
    return result;
  }

  private async ensureCatalogs(tx: Tx, obraIds: string[]) {
    await tx.catalogacao.createMany({
      data: obraIds.map((obraId) => ({ obraId })),
      skipDuplicates: true,
    });
  }

  /** Caminho legível ("Casa / Sala") de cada localização, para o histórico. */
  private async locationPaths(tx: Tx, projetoId: string) {
    const rows = await tx.localizacao.findMany({
      where: { projetoId },
      select: { id: true, nome: true, paiId: true },
    });
    const byId = new Map(rows.map((row) => [row.id, row]));
    return (id: string | null) => {
      if (!id) return null;
      const names: string[] = [];
      const seen = new Set<string>();
      let cursor = byId.get(id);
      while (cursor && !seen.has(cursor.id)) {
        seen.add(cursor.id);
        names.unshift(cursor.nome);
        cursor = cursor.paiId ? byId.get(cursor.paiId) : undefined;
      }
      return names.join(' / ');
    };
  }
}
