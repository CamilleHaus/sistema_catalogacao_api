import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PapelUsuario, Prisma, StatusProjeto } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import type { UserProjectAccessDto } from '../common/dto/project-access.dto';
import { PrismaService } from '../database/prisma.service';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import type { ReactivateProjectDto } from './dto/reactivate-project.dto';
import type { UpdateProjectUsersDto } from './dto/update-project-users.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(currentUser: AuthenticatedUser, query: ListProjectsQueryDto) {
    const empresaId = this.getCompanyId(currentUser);
    const search = query.busca?.trim();

    const projetos = await this.prisma.projeto.findMany({
      where: {
        empresaId,
        ...(search
          ? { nome: { contains: search, mode: 'insensitive' as const } }
          : {}),
        ...(currentUser.papel === PapelUsuario.USUARIO
          ? {
              status: StatusProjeto.ATIVO,
              usuarios: { some: { usuarioId: currentUser.id } },
            }
          : query.status
            ? { status: query.status }
            : {}),
      },
      select: {
        id: true,
        empresaId: true,
        nome: true,
        status: true,
        cliente: { select: { id: true, nome: true, codigo: true } },
        criadoEm: true,
        atualizadoEm: true,
        ...(currentUser.papel === PapelUsuario.ADMIN_EMPRESA
          ? { _count: { select: { usuarios: true } } }
          : {}),
        usuarios: {
          where: { usuarioId: currentUser.id },
          select: { permissao: true },
        },
      },
      orderBy: { nome: 'asc' },
    });

    return projetos.map(({ usuarios, ...projeto }) => ({
      ...projeto,
      ...(currentUser.papel === PapelUsuario.USUARIO
        ? { permissao: usuarios[0]?.permissao }
        : {}),
    }));
  }

  async create(currentUser: AuthenticatedUser, dto: CreateProjectDto) {
    const empresaId = this.getCompanyId(currentUser);
    const cliente = await this.prisma.cliente.findFirst({
      where: { id: dto.clienteId, empresaId },
      select: { id: true },
    });
    if (!cliente) {
      throw new BadRequestException(
        'Cliente inválido ou pertencente a outra empresa.',
      );
    }

    try {
      return await this.prisma.projeto.create({
        data: {
          empresaId,
          clienteId: cliente.id,
          nome: dto.nome.trim(),
        },
        include: { cliente: true },
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  async findOne(currentUser: AuthenticatedUser, projetoId: string) {
    const projeto = await this.prisma.projeto.findFirst({
      where: this.accessWhere(currentUser, projetoId),
      select: {
        id: true,
        empresaId: true,
        nome: true,
        status: true,
        cliente: { select: { id: true, nome: true, codigo: true } },
        criadoEm: true,
        atualizadoEm: true,
        ...(currentUser.papel === PapelUsuario.ADMIN_EMPRESA
          ? { _count: { select: { usuarios: true } } }
          : {}),
        usuarios: {
          where: { usuarioId: currentUser.id },
          select: { permissao: true },
        },
      },
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    const { usuarios, ...dadosProjeto } = projeto;
    return {
      ...dadosProjeto,
      ...(currentUser.papel === PapelUsuario.USUARIO
        ? { permissao: usuarios[0]?.permissao }
        : {}),
    };
  }

  async update(
    currentUser: AuthenticatedUser,
    projetoId: string,
    dto: UpdateProjectDto,
  ) {
    const projeto = await this.requireCompanyProject(currentUser, projetoId);

    try {
      return await this.prisma.projeto.update({
        where: { id: projeto.id },
        data: { nome: dto.nome.trim() },
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  async archive(currentUser: AuthenticatedUser, projetoId: string) {
    const projeto = await this.requireCompanyProject(currentUser, projetoId);

    if (projeto.status === StatusProjeto.ARQUIVADO) {
      throw new BadRequestException('O projeto já está arquivado.');
    }

    return this.prisma.projeto.update({
      where: { id: projeto.id },
      data: { status: StatusProjeto.ARQUIVADO },
    });
  }

  async reactivationPreview(currentUser: AuthenticatedUser, projetoId: string) {
    const projeto = await this.requireCompanyProject(currentUser, projetoId);

    if (projeto.status !== StatusProjeto.ARQUIVADO) {
      throw new BadRequestException('O projeto não está arquivado.');
    }

    const vinculos = await this.prisma.usuarioProjeto.findMany({
      where: { projetoId },
      select: {
        permissao: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            ativo: true,
            papel: true,
          },
        },
      },
      orderBy: { usuario: { nome: 'asc' } },
    });

    return {
      projeto,
      usuariosComVinculo: vinculos.map(({ usuario, permissao }) => ({
        ...usuario,
        permissao,
      })),
    };
  }

  async reactivate(
    currentUser: AuthenticatedUser,
    projetoId: string,
    dto: ReactivateProjectDto,
  ) {
    const empresaId = this.getCompanyId(currentUser);
    const userAccesses = this.uniqueUserAccesses(dto.usuarios);
    const userIds = userAccesses.map(({ usuarioId }) => usuarioId);
    const confirmedDeactivationIds = new Set(
      this.uniqueIds(dto.confirmarDesativacaoUsuarioIds ?? []),
    );

    return this.prisma.$transaction(async (transaction) => {
      const projeto = await this.requireCompanyProject(
        currentUser,
        projetoId,
        transaction,
      );

      if (projeto.status !== StatusProjeto.ARQUIVADO) {
        throw new BadRequestException('O projeto não está arquivado.');
      }

      await this.validateActiveCommonUsers(transaction, empresaId, userIds);
      const currentLinks = await transaction.usuarioProjeto.findMany({
        where: { projetoId },
        select: { usuarioId: true },
      });
      const desiredSet = new Set(userIds);
      const removedUserIds = currentLinks
        .map(({ usuarioId }) => usuarioId)
        .filter((usuarioId) => !desiredSet.has(usuarioId));
      const otherLinks =
        removedUserIds.length === 0
          ? []
          : await transaction.usuarioProjeto.groupBy({
              by: ['usuarioId'],
              where: {
                usuarioId: { in: removedUserIds },
                projetoId: { not: projetoId },
              },
              _count: { _all: true },
            });
      const usersWithOtherLinks = new Set(
        otherLinks.map(({ usuarioId }) => usuarioId),
      );
      const activeUsersLosingLastProject = await transaction.usuario.findMany({
        where: {
          id: {
            in: removedUserIds.filter(
              (usuarioId) => !usersWithOtherLinks.has(usuarioId),
            ),
          },
          ativo: true,
          papel: PapelUsuario.USUARIO,
        },
        select: { id: true },
      });
      const usersToDeactivate = activeUsersLosingLastProject.map(
        ({ id }) => id,
      );
      const missingConfirmations = usersToDeactivate.filter(
        (usuarioId) => !confirmedDeactivationIds.has(usuarioId),
      );

      if (missingConfirmations.length > 0) {
        throw new ConflictException({
          code: 'LAST_PROJECT_REMOVAL_REQUIRES_CONFIRMATION',
          message:
            'A remoção do último projeto exige confirmação da desativação dos usuários.',
          details: { usuarioIds: missingConfirmations },
        });
      }

      await transaction.usuarioProjeto.deleteMany({ where: { projetoId } });

      for (const usuarioId of usersToDeactivate) {
        await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
        await transaction.sessao.updateMany({
          where: { usuarioId, revogadoEm: null },
          data: { revogadoEm: new Date() },
        });
        await transaction.usuario.update({
          where: { id: usuarioId },
          data: { ativo: false },
        });
      }

      if (userIds.length > 0) {
        await transaction.usuarioProjeto.createMany({
          data: userAccesses.map((acesso) => ({ projetoId, ...acesso })),
        });
      }

      return transaction.projeto.update({
        where: { id: projetoId },
        data: { status: StatusProjeto.ATIVO },
      });
    });
  }

  async listUsers(currentUser: AuthenticatedUser, projetoId: string) {
    await this.requireCompanyProject(currentUser, projetoId);

    return this.prisma.usuarioProjeto.findMany({
      where: { projetoId },
      select: {
        criadoEm: true,
        permissao: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            ativo: true,
            papel: true,
          },
        },
      },
      orderBy: { usuario: { nome: 'asc' } },
    });
  }

  async updateUsers(
    currentUser: AuthenticatedUser,
    projetoId: string,
    dto: UpdateProjectUsersDto,
  ) {
    const empresaId = this.getCompanyId(currentUser);
    const desiredAccesses = this.uniqueUserAccesses(dto.usuarios);
    const desiredUserIds = desiredAccesses.map(({ usuarioId }) => usuarioId);
    const confirmedDeactivationIds = new Set(
      this.uniqueIds(dto.confirmarDesativacaoUsuarioIds ?? []),
    );

    return this.prisma.$transaction(async (transaction) => {
      const projeto = await this.requireCompanyProject(
        currentUser,
        projetoId,
        transaction,
      );

      if (projeto.status !== StatusProjeto.ATIVO) {
        throw new BadRequestException(
          'Edite os vínculos durante a reativação do projeto arquivado.',
        );
      }

      await this.validateActiveCommonUsers(
        transaction,
        empresaId,
        desiredUserIds,
      );

      const currentLinks = await transaction.usuarioProjeto.findMany({
        where: { projetoId },
        select: { usuarioId: true },
      });
      const desiredSet = new Set(desiredUserIds);
      const currentSet = new Set(
        currentLinks.map(({ usuarioId }) => usuarioId),
      );
      const removedUserIds = [...currentSet].filter(
        (id) => !desiredSet.has(id),
      );
      const otherLinks =
        removedUserIds.length === 0
          ? []
          : await transaction.usuarioProjeto.groupBy({
              by: ['usuarioId'],
              where: {
                usuarioId: { in: removedUserIds },
                projetoId: { not: projetoId },
              },
              _count: { _all: true },
            });
      const usersWithOtherLinks = new Set(
        otherLinks.map(({ usuarioId }) => usuarioId),
      );
      const usersLosingLastProject = removedUserIds.filter(
        (usuarioId) => !usersWithOtherLinks.has(usuarioId),
      );
      const missingConfirmations = usersLosingLastProject.filter(
        (usuarioId) => !confirmedDeactivationIds.has(usuarioId),
      );

      if (missingConfirmations.length > 0) {
        throw new ConflictException({
          code: 'LAST_PROJECT_REMOVAL_REQUIRES_CONFIRMATION',
          message:
            'A remoção do último projeto exige confirmação da desativação dos usuários.',
          details: { usuarioIds: missingConfirmations },
        });
      }

      if (removedUserIds.length > 0) {
        await transaction.usuarioProjeto.deleteMany({
          where: { projetoId, usuarioId: { in: removedUserIds } },
        });
      }

      for (const usuarioId of usersLosingLastProject) {
        await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
        await transaction.sessao.updateMany({
          where: { usuarioId, revogadoEm: null },
          data: { revogadoEm: new Date() },
        });
        await transaction.usuario.update({
          where: { id: usuarioId },
          data: { ativo: false },
        });
      }

      const addedUserIds = desiredUserIds.filter((id) => !currentSet.has(id));
      if (addedUserIds.length > 0) {
        await transaction.usuarioProjeto.createMany({
          data: desiredAccesses
            .filter(({ usuarioId }) => addedUserIds.includes(usuarioId))
            .map((acesso) => ({ projetoId, ...acesso })),
        });
      }

      for (const { usuarioId, permissao } of desiredAccesses) {
        await transaction.usuarioProjeto.updateMany({
          where: { projetoId, usuarioId },
          data: { permissao },
        });
      }

      return transaction.usuarioProjeto.findMany({
        where: { projetoId },
        select: {
          criadoEm: true,
          permissao: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              ativo: true,
              papel: true,
            },
          },
        },
        orderBy: { usuario: { nome: 'asc' } },
      });
    });
  }

  private accessWhere(currentUser: AuthenticatedUser, projetoId: string) {
    const empresaId = this.getCompanyId(currentUser);

    return {
      id: projetoId,
      empresaId,
      ...(currentUser.papel === PapelUsuario.USUARIO
        ? {
            status: StatusProjeto.ATIVO,
            usuarios: { some: { usuarioId: currentUser.id } },
          }
        : {}),
    } satisfies Prisma.ProjetoWhereInput;
  }

  private async requireCompanyProject(
    currentUser: AuthenticatedUser,
    projetoId: string,
    client: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const projeto = await client.projeto.findFirst({
      where: {
        id: projetoId,
        empresaId: this.getCompanyId(currentUser),
      },
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return projeto;
  }

  private async validateActiveCommonUsers(
    client: Prisma.TransactionClient,
    empresaId: string,
    userIds: string[],
  ) {
    if (userIds.length === 0) return;

    const count = await client.usuario.count({
      where: {
        id: { in: userIds },
        empresaId,
        papel: PapelUsuario.USUARIO,
        ativo: true,
      },
    });

    if (count !== userIds.length) {
      throw new BadRequestException(
        'Um ou mais usuários são inválidos, inativos, administradores ou pertencem a outra empresa.',
      );
    }
  }

  private getCompanyId(user: AuthenticatedUser) {
    if (!user.empresaId) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return user.empresaId;
  }

  private uniqueIds(ids: string[]) {
    return [...new Set(ids)];
  }

  private uniqueUserAccesses(accesses: UserProjectAccessDto[]) {
    return [
      ...new Map(accesses.map((access) => [access.usuarioId, access])).values(),
    ];
  }

  private handleUniqueConstraint(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Já existe um projeto com esse nome para este cliente.',
      );
    }
  }
}
