import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';
import type { CreateLocationDto } from './dto/create-location.dto';
import type { UpdateLocationDto } from './dto/update-location.dto';

type LocationRow = {
  id: string;
  projetoId: string;
  nome: string;
  paiId: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
  /** Obras e movimentações que apontam para a localização. */
  vinculos: number;
};
type LocationNode = LocationRow & { filhos: LocationNode[] };

const LINK_COUNT = {
  _count: {
    select: {
      obras: true,
      movimentacoesSaida: true,
      movimentacoesEntrada: true,
    },
  },
} as const;

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listTree(projetoId: string) {
    const rows = await this.prisma.localizacao.findMany({
      where: { projetoId },
      orderBy: { nome: 'asc' },
      include: LINK_COUNT,
    });
    return this.buildTree(
      rows.map(({ _count, ...row }) => ({
        ...row,
        vinculos:
          _count.obras +
          _count.movimentacoesSaida +
          _count.movimentacoesEntrada,
      })),
    );
  }

  async remove(
    user: AuthenticatedUser,
    projetoId: string,
    localizacaoId: string,
  ) {
    this.assertCompany(user);
    await this.requireLocation(projetoId, localizacaoId);
    const location = await this.prisma.localizacao.findUniqueOrThrow({
      where: { id: localizacaoId },
      include: {
        _count: { select: { ...LINK_COUNT._count.select, filhos: true } },
      },
    });
    const { filhos, obras, movimentacoesSaida, movimentacoesEntrada } =
      location._count;
    if (filhos > 0) {
      throw new ConflictException(
        'Exclua as sublocalizações antes de excluir esta localização.',
      );
    }
    if (obras + movimentacoesSaida + movimentacoesEntrada > 0) {
      throw new ConflictException(
        'Esta localização tem obras ou movimentações vinculadas e não pode ser excluída.',
      );
    }
    try {
      await this.prisma.localizacao.delete({ where: { id: localizacaoId } });
    } catch (error) {
      // Um vínculo criado entre a checagem e o delete cai na restrição do banco.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'Esta localização tem vínculos e não pode ser excluída.',
        );
      }
      throw error;
    }
  }

  async create(
    user: AuthenticatedUser,
    projetoId: string,
    dto: CreateLocationDto,
  ) {
    this.assertCompany(user);
    if (dto.paiId) await this.requireLocation(projetoId, dto.paiId);
    try {
      return await this.prisma.localizacao.create({
        data: { projetoId, nome: dto.nome.trim(), paiId: dto.paiId ?? null },
      });
    } catch (error) {
      this.handleUnique(error);
      throw error;
    }
  }

  async update(
    user: AuthenticatedUser,
    projetoId: string,
    localizacaoId: string,
    dto: UpdateLocationDto,
  ) {
    this.assertCompany(user);
    if (dto.nome === undefined && dto.paiId === undefined) {
      throw new BadRequestException('Informe nome ou localização-pai.');
    }
    await this.requireLocation(projetoId, localizacaoId);

    if (dto.paiId !== undefined && dto.paiId !== null) {
      if (dto.paiId === localizacaoId) {
        throw new BadRequestException(
          'Uma localização não pode ser pai de si mesma.',
        );
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
    } catch (error) {
      this.handleUnique(error);
      throw error;
    }
  }

  private async assertNoCycle(
    projetoId: string,
    localizacaoId: string,
    novoPaiId: string,
  ) {
    let cursor: string | null = novoPaiId;
    const visited = new Set<string>();
    while (cursor) {
      if (cursor === localizacaoId) {
        throw new BadRequestException(
          'Não é possível mover uma localização para dentro de seus descendentes.',
        );
      }
      if (visited.has(cursor)) {
        throw new BadRequestException(
          'A árvore de localizações contém um ciclo.',
        );
      }
      visited.add(cursor);
      const parent: { paiId: string | null } | null =
        await this.prisma.localizacao.findFirst({
          where: { id: cursor, projetoId },
          select: { paiId: true },
        });
      cursor = parent?.paiId ?? null;
    }
  }

  private async requireLocation(projetoId: string, id: string) {
    const location = await this.prisma.localizacao.findFirst({
      where: { id, projetoId },
    });
    if (!location) throw new NotFoundException('Localização não encontrada.');
    return location;
  }

  private buildTree(rows: LocationRow[]) {
    const nodes = new Map<string, LocationNode>(
      rows.map((row) => [row.id, { ...row, filhos: [] }]),
    );
    const roots: LocationNode[] = [];
    for (const node of nodes.values()) {
      const parent = node.paiId ? nodes.get(node.paiId) : undefined;
      if (parent) parent.filhos.push(node);
      else roots.push(node);
    }
    return roots;
  }

  private assertCompany(user: AuthenticatedUser) {
    if (!user.empresaId) throw new NotFoundException('Empresa não encontrada.');
  }

  private handleUnique(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Já existe uma localização com esse nome nesse nível.',
      );
    }
  }
}
