import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PapelUsuario,
  PermissaoProjeto,
  Prisma,
  StatusProjeto,
} from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AuthorizationService } from '../auth/authorization.service';
import { validateDimensionInput } from '../common/utils/dimensions';
import { presentDimension } from '../common/utils/measurements';
import { PrismaService } from '../database/prisma.service';
import type { ListWorkSetsQueryDto, SaveWorkSetDto } from './dto/work-set.dto';

const NO_DIMENSION = {
  altura: null,
  largura: null,
  profundidade: null,
  unidade: null,
  descricaoVariavel: null,
};

@Injectable()
export class WorkSetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authorization: AuthorizationService,
  ) {}

  async list(user: AuthenticatedUser, query: ListWorkSetsQueryDto) {
    if (query.projetoId)
      await this.authorization.assertProjectAccess(user, query.projetoId);
    const items = await this.prisma.fichaMae.findMany({
      where: query.projetoId
        ? { projetoId: query.projetoId }
        : { projeto: this.visibleProjects(user) },
      include: this.relations,
      orderBy: [{ projeto: { nome: 'asc' } }, { codigo: 'asc' }],
    });
    return items.map((item) => this.present(item));
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const item = await this.prisma.fichaMae.findFirst({
      where: { id, projeto: this.visibleProjects(user) },
      include: {
        ...this.relations,
        obras: {
          select: {
            id: true,
            projetoId: true,
            codigoAcervo: true,
            titulo: true,
          },
          orderBy: { codigoAcervo: 'asc' },
        },
      },
    });
    if (!item) throw new NotFoundException('Ficha mãe não encontrada.');
    return { ...this.present(item), obras: item.obras };
  }

  async create(user: AuthenticatedUser, dto: SaveWorkSetDto) {
    await this.authorization.assertProjectAccess(
      user,
      dto.projetoId,
      PermissaoProjeto.EDITAR,
    );
    try {
      const item = await this.prisma.fichaMae.create({
        data: { projetoId: dto.projetoId, ...this.fields(dto) },
        include: this.relations,
      });
      return this.present(item);
    } catch (error) {
      this.unique(error);
      throw error;
    }
  }

  async update(user: AuthenticatedUser, id: string, dto: SaveWorkSetDto) {
    const current = await this.prisma.fichaMae.findFirst({
      where: { id, projeto: this.visibleProjects(user) },
      select: { projetoId: true, _count: { select: { obras: true } } },
    });
    if (!current) throw new NotFoundException('Ficha mãe não encontrada.');
    await this.authorization.assertProjectAccess(
      user,
      current.projetoId,
      PermissaoProjeto.EDITAR,
    );
    if (dto.projetoId !== current.projetoId) {
      // As obras vinculadas são do projeto atual; trocar deixaria o vínculo inválido.
      if (current._count.obras)
        throw new BadRequestException(
          'Não é possível trocar o projeto de uma ficha mãe com obras vinculadas.',
        );
      await this.authorization.assertProjectAccess(
        user,
        dto.projetoId,
        PermissaoProjeto.EDITAR,
      );
    }
    try {
      const item = await this.prisma.fichaMae.update({
        where: { id },
        data: { projetoId: dto.projetoId, ...this.fields(dto) },
        include: this.relations,
      });
      return this.present(item);
    } catch (error) {
      this.unique(error);
      throw error;
    }
  }

  private fields(dto: SaveWorkSetDto) {
    const hasDimension =
      dto.altura !== undefined ||
      dto.largura !== undefined ||
      dto.profundidade !== undefined ||
      dto.unidade !== undefined ||
      Boolean(dto.descricaoVariavel?.trim());
    const codigo = dto.codigo.trim();
    const descricao = dto.descricao.trim();
    if (!codigo || !descricao)
      throw new BadRequestException('Código e descrição são obrigatórios.');
    return {
      codigo,
      descricao,
      imagemUrl: dto.imagemUrl?.trim() || null,
      ...(hasDimension ? validateDimensionInput(dto) : NO_DIMENSION),
    };
  }

  private unique(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    )
      throw new ConflictException(
        'Já existe uma ficha mãe com esse código neste projeto.',
      );
  }

  /** Projetos que o usuário enxerga: todos da empresa, ou os seus se for USUARIO. */
  private visibleProjects(user: AuthenticatedUser) {
    if (!user.empresaId || user.papel === PapelUsuario.ADMIN_GLOBAL)
      throw new NotFoundException('Empresa não encontrada.');
    return {
      empresaId: user.empresaId,
      ...(user.papel === PapelUsuario.USUARIO
        ? {
            status: StatusProjeto.ATIVO,
            usuarios: { some: { usuarioId: user.id } },
          }
        : {}),
    };
  }

  private readonly relations = {
    projeto: { select: { id: true, nome: true } },
    _count: { select: { obras: true } },
  } as const;

  private present<
    T extends {
      altura: { toNumber(): number } | null;
      largura: { toNumber(): number } | null;
      profundidade: { toNumber(): number } | null;
      unidade: import('@prisma/client').UnidadeMedida | null;
      descricaoVariavel: string | null;
      _count: { obras: number };
    },
  >(item: T) {
    const {
      altura,
      largura,
      profundidade,
      unidade,
      descricaoVariavel,
      _count,
      ...rest
    } = item;
    const dimension = {
      altura,
      largura,
      profundidade,
      unidade,
      descricaoVariavel,
    };
    return {
      ...rest,
      dimensao:
        unidade || descricaoVariavel ? presentDimension(dimension) : null,
      totalObras: _count.obras,
    };
  }
}
