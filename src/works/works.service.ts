import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { presentDimension } from '../common/utils/measurements';
import { buildCollectionCode } from '../common/utils/catalog';
import type { CreateWorkDto } from './dto/create-work.dto';
import type { ListWorksQueryDto } from './dto/list-works-query.dto';
import type { UpdateWorkDto } from './dto/update-work.dto';

@Injectable()
export class WorksService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projetoId: string, query: ListWorksQueryDto) {
    const busca = query.busca?.trim();
    return this.listWhere(projetoId, {
      ...(busca
        ? {
            OR: [
              { codigoAcervo: { contains: busca, mode: 'insensitive' } },
              { numeroManual: { contains: busca, mode: 'insensitive' } },
              { titulo: { contains: busca, mode: 'insensitive' } },
              {
                artistas: {
                  some: {
                    artista: {
                      nome: { contains: busca, mode: 'insensitive' },
                    },
                  },
                },
              },
            ],
          }
        : {}),
    });
  }

  /** Listagem do acervo com um filtro extra; usada também pela busca avançada. */
  async listWhere(projetoId: string, where: Prisma.ObraWhereInput) {
    const works = await this.prisma.obra.findMany({
      // projetoId por fora do filtro: nenhuma condição escapa do projeto.
      where: { AND: [{ projetoId }, where] },
      include: this.relations,
      orderBy: { codigoAcervo: 'asc' },
    });
    return works.map((work) => this.present(work));
  }

  async findOne(projetoId: string, obraId: string) {
    const work = await this.prisma.obra.findFirst({
      where: { id: obraId, projetoId },
      include: this.relations,
    });
    if (!work) throw new NotFoundException('Obra não encontrada.');
    return this.present(work);
  }

  async create(projetoId: string, dto: CreateWorkDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const context = await this.projectContext(tx, projetoId);
        const artistaIds = this.unique(dto.artistaIds ?? []);
        await this.validateRelations(tx, context, {
          artistaIds,
          statusId: dto.statusId,
          tecnicaId: dto.tecnicaId,
          localizacaoId: dto.localizacaoId,
          fichaMaeId: dto.fichaMaeId,
        });
        const numeroManual = dto.numeroManual.trim();
        const work = await tx.obra.create({
          data: {
            projetoId,
            numeroManual,
            codigoAcervo: buildCollectionCode(
              numeroManual,
              context.cliente.codigo,
            ),
            titulo: this.text(dto.titulo),
            edicao: this.text(dto.edicao),
            data: this.text(dto.data),
            ...this.partes(dto.quantidadePartes),
            ...this.serie(dto.tituloSerie),
            fichaMaeId: dto.fichaMaeId ?? null,
            statusId: dto.statusId ?? null,
            tecnicaId: dto.tecnicaId ?? null,
            localizacaoId: dto.localizacaoId ?? null,
            artistas: artistaIds.length
              ? { create: artistaIds.map((artistaId) => ({ artistaId })) }
              : undefined,
          },
          include: this.relations,
        });
        return this.present(work);
      });
    } catch (error) {
      this.handleUnique(error);
      throw error;
    }
  }

  async update(projetoId: string, obraId: string, dto: UpdateWorkDto) {
    if (Object.values(dto).every((value) => value === undefined)) {
      throw new BadRequestException(
        'Informe ao menos um campo para atualização.',
      );
    }
    try {
      return await this.prisma.$transaction(async (tx) => {
        const context = await this.projectContext(tx, projetoId);
        const existing = await tx.obra.findFirst({
          where: { id: obraId, projetoId },
          select: { id: true },
        });
        if (!existing) throw new NotFoundException('Obra não encontrada.');
        const artistaIds =
          dto.artistaIds === undefined
            ? undefined
            : this.unique(dto.artistaIds);
        await this.validateRelations(tx, context, {
          artistaIds,
          statusId: dto.statusId,
          tecnicaId: dto.tecnicaId,
          localizacaoId: dto.localizacaoId,
          fichaMaeId: dto.fichaMaeId,
        });
        if (artistaIds !== undefined) {
          await tx.obraArtista.deleteMany({ where: { obraId } });
          if (artistaIds.length)
            await tx.obraArtista.createMany({
              data: artistaIds.map((artistaId) => ({ obraId, artistaId })),
            });
        }
        const numeroManual = dto.numeroManual?.trim();
        const work = await tx.obra.update({
          where: { id: obraId },
          data: {
            ...(numeroManual === undefined
              ? {}
              : {
                  numeroManual,
                  codigoAcervo: buildCollectionCode(
                    numeroManual,
                    context.cliente.codigo,
                  ),
                }),
            ...(dto.titulo === undefined
              ? {}
              : { titulo: this.text(dto.titulo) }),
            ...(dto.edicao === undefined
              ? {}
              : { edicao: this.text(dto.edicao) }),
            ...(dto.data === undefined ? {} : { data: this.text(dto.data) }),
            ...(dto.quantidadePartes === undefined
              ? {}
              : this.partes(dto.quantidadePartes)),
            ...(dto.tituloSerie === undefined
              ? {}
              : this.serie(dto.tituloSerie)),
            ...(dto.fichaMaeId === undefined
              ? {}
              : { fichaMaeId: dto.fichaMaeId }),
            ...(dto.statusId === undefined ? {} : { statusId: dto.statusId }),
            ...(dto.tecnicaId === undefined
              ? {}
              : { tecnicaId: dto.tecnicaId }),
            ...(dto.localizacaoId === undefined
              ? {}
              : { localizacaoId: dto.localizacaoId }),
          },
          include: this.relations,
        });
        return this.present(work);
      });
    } catch (error) {
      this.handleUnique(error);
      throw error;
    }
  }

  private async projectContext(
    tx: Prisma.TransactionClient,
    projetoId: string,
  ) {
    const project = await tx.projeto.findUnique({
      where: { id: projetoId },
      select: {
        id: true,
        empresaId: true,
        cliente: { select: { codigo: true } },
      },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado.');
    return project;
  }

  private async validateRelations(
    tx: Prisma.TransactionClient,
    context: { id: string; empresaId: string },
    refs: {
      artistaIds?: string[];
      statusId?: string | null;
      tecnicaId?: string | null;
      localizacaoId?: string | null;
      fichaMaeId?: string | null;
    },
  ) {
    const checks: Promise<unknown>[] = [];
    if (refs.artistaIds !== undefined && refs.artistaIds.length)
      checks.push(
        tx.artista
          .count({
            where: {
              id: { in: refs.artistaIds },
              empresaId: context.empresaId,
            },
          })
          .then((count) => {
            if (count !== refs.artistaIds?.length)
              throw new BadRequestException(
                'Um ou mais artistas não pertencem à empresa do projeto.',
              );
          }),
      );
    if (refs.statusId)
      checks.push(
        tx.statusObra
          .findFirst({
            where: { id: refs.statusId, empresaId: context.empresaId },
            select: { id: true },
          })
          .then((item) => {
            if (!item)
              throw new BadRequestException(
                'Status inválido para a empresa do projeto.',
              );
          }),
      );
    if (refs.tecnicaId)
      checks.push(
        tx.tecnica
          .findFirst({
            where: {
              id: refs.tecnicaId,
              empresaId: context.empresaId,
              OR: [{ projetoId: null }, { projetoId: context.id }],
            },
            select: { id: true },
          })
          .then((item) => {
            if (!item)
              throw new BadRequestException(
                'Técnica inválida para este projeto.',
              );
          }),
      );
    if (refs.localizacaoId)
      checks.push(
        tx.localizacao
          .findFirst({
            where: { id: refs.localizacaoId, projetoId: context.id },
            select: { id: true },
          })
          .then((item) => {
            if (!item)
              throw new BadRequestException(
                'Localização inválida para este projeto.',
              );
          }),
      );
    if (refs.fichaMaeId)
      checks.push(
        tx.fichaMae
          .findFirst({
            where: { id: refs.fichaMaeId, projetoId: context.id },
            select: { id: true },
          })
          .then((item) => {
            if (!item)
              throw new BadRequestException(
                'Ficha mãe inválida para este projeto.',
              );
          }),
      );
    await Promise.all(checks);
  }

  private readonly relations = {
    imagemPrincipal: { select: { id: true, imagemUrl: true, creditos: true } },
    status: { select: { id: true, nome: true } },
    tecnica: { select: { id: true, nome: true, projetoId: true } },
    localizacao: { select: { id: true, nome: true, paiId: true } },
    artistas: {
      select: { artista: true },
      orderBy: { artista: { nome: 'asc' as const } },
    },
    dimensoes: { orderBy: { tipo: 'asc' as const } },
    fichaMae: { select: { id: true, codigo: true, descricao: true } },
  } satisfies Prisma.ObraInclude;

  private present<
    T extends {
      titulo: string | null;
      artistas: { artista: unknown }[];
      dimensoes: Array<{
        altura: { toNumber(): number } | null;
        largura: { toNumber(): number } | null;
        profundidade: { toNumber(): number } | null;
        unidade: import('@prisma/client').UnidadeMedida | null;
        descricaoVariavel: string | null;
      }>;
    },
  >(work: T) {
    const { artistas, dimensoes, ...data } = work;
    const result = {
      ...data,
      tituloExibicao: work.titulo?.trim() || 'Sem título',
      artistas: artistas.map(({ artista }) => artista),
      dimensoes: dimensoes.map((dimension) => presentDimension(dimension)),
    };
    const media = data as typeof data & {
      fotoPrincipalUrl?: string | null;
      imagemPrincipal?: { imagemUrl: string; creditos: string | null } | null;
    };
    return {
      ...result,
      fotoPrincipalUrl:
        media.imagemPrincipal?.imagemUrl ?? media.fotoPrincipalUrl ?? null,
      fotoPrincipalCreditos: media.imagemPrincipal?.creditos ?? null,
    };
  }
  /** Os booleanos não vêm do cliente: valem enquanto o campo que os descreve estiver preenchido. */
  private partes(quantidadePartes?: number | null) {
    return {
      grupoObra: quantidadePartes != null,
      quantidadePartes: quantidadePartes ?? null,
    };
  }
  private serie(tituloSerie?: string | null) {
    const titulo = this.text(tituloSerie);
    return { serie: titulo !== null, tituloSerie: titulo };
  }
  private text(value?: string | null) {
    const normalized = value?.trim();
    return normalized || null;
  }
  private unique(ids: string[]) {
    return [...new Set(ids)];
  }
  private handleUnique(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    )
      throw new ConflictException(
        'Já existe uma obra com esse código de acervo no projeto.',
      );
  }
}
