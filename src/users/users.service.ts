import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PapelUsuario, Prisma, StatusProjeto } from '@prisma/client';
import type { ProjectAccessDto } from '../common/dto/project-access.dto';
import * as argon2 from 'argon2';
import type { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { ListCompanyUsersQueryDto } from './dto/list-users-query.dto';
import type { UpdateRoleDto } from './dto/update-role.dto';
import type { UpdateUserProjectsDto } from './dto/update-user-projects.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(currentUser: AuthenticatedUser, query: ListCompanyUsersQueryDto) {
    const empresaId = this.getCompanyId(currentUser);
    const search = query.busca?.trim();
    const where: Prisma.UsuarioWhereInput = {
      empresaId,
      ...(query.papel ? { papel: query.papel } : {}),
      ...(query.ativo === undefined ? {} : { ativo: query.ativo }),
      ...(search
        ? {
            OR: [
              { nome: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const skip = (query.pagina - 1) * query.limite;
    const [usuarios, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        where,
        select: {
          ...this.safeUserSelect,
          _count: { select: { projetos: true } },
        },
        orderBy: { nome: 'asc' },
        skip,
        take: query.limite,
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return {
      dados: usuarios,
      paginacao: {
        pagina: query.pagina,
        limite: query.limite,
        total,
        totalPaginas: Math.ceil(total / query.limite),
      },
    };
  }

  async create(currentUser: AuthenticatedUser, dto: CreateUserDto) {
    const empresaId = this.getCompanyId(currentUser);
    const projectAccesses = this.uniqueProjectAccesses(dto.projetos ?? []);
    const projectIds = projectAccesses.map(({ projetoId }) => projetoId);

    if (dto.papel === PapelUsuario.USUARIO && projectIds.length === 0) {
      throw new BadRequestException(
        'Usuário comum deve possuir ao menos um projeto ativo.',
      );
    }

    if (dto.papel === PapelUsuario.ADMIN_EMPRESA && projectIds.length > 0) {
      throw new BadRequestException(
        'Administradores da empresa não utilizam vínculos com projetos.',
      );
    }

    const passwordHash = await argon2.hash(dto.senhaTemporaria, {
      type: argon2.argon2id,
    });

    try {
      return await this.prisma.$transaction(async (transaction) => {
        if (dto.papel === PapelUsuario.USUARIO) {
          await this.validateActiveProjects(transaction, empresaId, projectIds);
        }

        return transaction.usuario.create({
          data: {
            empresaId,
            nome: dto.nome.trim(),
            email: dto.email.trim().toLowerCase(),
            senhaHash: passwordHash,
            papel: dto.papel,
            ativo: true,
            deveAlterarSenha: true,
            projetos:
              dto.papel === PapelUsuario.USUARIO
                ? {
                    create: projectAccesses,
                  }
                : undefined,
          },
          select: this.safeUserSelect,
        });
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  async findOne(currentUser: AuthenticatedUser, usuarioId: string) {
    const user = await this.prisma.usuario.findFirst({
      where: { id: usuarioId, empresaId: this.getCompanyId(currentUser) },
      select: {
        ...this.safeUserSelect,
        projetos: {
          select: {
            criadoEm: true,
            permissao: true,
            projeto: {
              select: { id: true, nome: true, status: true },
            },
          },
          orderBy: { projeto: { nome: 'asc' } },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async update(
    currentUser: AuthenticatedUser,
    usuarioId: string,
    dto: UpdateUserDto,
  ) {
    const empresaId = this.getCompanyId(currentUser);

    if (dto.nome === undefined && dto.email === undefined) {
      throw new BadRequestException('Informe nome ou e-mail para atualização.');
    }

    await this.requireScopedUser(usuarioId, empresaId);

    try {
      return await this.prisma.usuario.update({
        where: { id: usuarioId },
        data: {
          ...(dto.nome === undefined ? {} : { nome: dto.nome.trim() }),
          ...(dto.email === undefined
            ? {}
            : { email: dto.email.trim().toLowerCase() }),
        },
        select: this.safeUserSelect,
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  async updateRole(
    currentUser: AuthenticatedUser,
    usuarioId: string,
    dto: UpdateRoleDto,
  ) {
    const empresaId = this.getCompanyId(currentUser);
    const projectAccesses = this.uniqueProjectAccesses(dto.projetos ?? []);
    const projectIds = projectAccesses.map(({ projetoId }) => projetoId);

    return this.prisma.$transaction(async (transaction) => {
      const target = await this.requireScopedUser(
        usuarioId,
        empresaId,
        transaction,
      );

      if (target.papel === dto.papel) {
        throw new BadRequestException('O usuário já possui esse papel.');
      }

      if (dto.papel === PapelUsuario.ADMIN_EMPRESA) {
        if (target.papel !== PapelUsuario.USUARIO) {
          throw new BadRequestException(
            'Apenas usuários comuns podem ser promovidos.',
          );
        }

        if (!target.ativo) {
          throw new BadRequestException(
            'O usuário deve estar ativo antes de ser promovido.',
          );
        }

        if (projectIds.length > 0) {
          throw new BadRequestException(
            'Administradores da empresa não utilizam vínculos com projetos.',
          );
        }

        await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
      } else {
        if (target.papel !== PapelUsuario.ADMIN_EMPRESA) {
          throw new BadRequestException(
            'Apenas administradores da empresa podem ser rebaixados.',
          );
        }

        if (currentUser.id === usuarioId) {
          throw new ForbiddenException('Você não pode rebaixar a si mesmo.');
        }

        if (!target.ativo) {
          throw new BadRequestException(
            'O administrador deve estar ativo antes de ser rebaixado.',
          );
        }

        if (projectIds.length === 0) {
          throw new BadRequestException(
            'Selecione ao menos um projeto ativo para o usuário.',
          );
        }

        await this.validateActiveProjects(transaction, empresaId, projectIds);
        await transaction.usuarioProjeto.createMany({
          data: projectAccesses.map((acesso) => ({ usuarioId, ...acesso })),
        });
      }

      const updatedUser = await transaction.usuario.update({
        where: { id: usuarioId },
        data: { papel: dto.papel },
        select: this.safeUserSelect,
      });
      await this.revokeSessions(transaction, usuarioId);

      return updatedUser;
    });
  }

  async deactivate(currentUser: AuthenticatedUser, usuarioId: string) {
    const empresaId = this.getCompanyId(currentUser);

    return this.prisma.$transaction(async (transaction) => {
      const target = await this.requireScopedUser(
        usuarioId,
        empresaId,
        transaction,
      );

      if (target.papel !== PapelUsuario.USUARIO) {
        throw new ForbiddenException(
          'Administradores da empresa só podem ser desativados pelo administrador global.',
        );
      }

      await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
      await this.revokeSessions(transaction, usuarioId);

      return transaction.usuario.update({
        where: { id: usuarioId },
        data: { ativo: false },
        select: this.safeUserSelect,
      });
    });
  }

  async reactivate(
    currentUser: AuthenticatedUser,
    usuarioId: string,
    rawProjectAccesses: ProjectAccessDto[],
  ) {
    const empresaId = this.getCompanyId(currentUser);
    const projectAccesses = this.uniqueProjectAccesses(rawProjectAccesses);
    const projectIds = projectAccesses.map(({ projetoId }) => projetoId);

    return this.prisma.$transaction(async (transaction) => {
      const target = await this.requireScopedUser(
        usuarioId,
        empresaId,
        transaction,
      );

      if (target.papel !== PapelUsuario.USUARIO) {
        throw new ForbiddenException(
          'Administradores da empresa só podem ser reativados pelo administrador global.',
        );
      }

      if (target.ativo) {
        throw new BadRequestException('O usuário já está ativo.');
      }

      await this.validateActiveProjects(transaction, empresaId, projectIds);
      await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
      await transaction.usuarioProjeto.createMany({
        data: projectAccesses.map((acesso) => ({ usuarioId, ...acesso })),
      });

      return transaction.usuario.update({
        where: { id: usuarioId },
        data: { ativo: true },
        select: this.safeUserSelect,
      });
    });
  }

  async updateProjects(
    currentUser: AuthenticatedUser,
    usuarioId: string,
    dto: UpdateUserProjectsDto,
  ) {
    const empresaId = this.getCompanyId(currentUser);
    const projectAccesses = this.uniqueProjectAccesses(dto.projetos);
    const projectIds = projectAccesses.map(({ projetoId }) => projetoId);

    return this.prisma.$transaction(async (transaction) => {
      const target = await this.requireScopedUser(
        usuarioId,
        empresaId,
        transaction,
      );

      if (target.papel !== PapelUsuario.USUARIO || !target.ativo) {
        throw new BadRequestException(
          'Os vínculos só podem ser alterados para usuários comuns ativos.',
        );
      }

      if (projectIds.length === 0) {
        if (!dto.confirmarDesativacao) {
          throw new ConflictException(
            'A remoção do último projeto exige confirmação da desativação.',
          );
        }

        await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
        await this.revokeSessions(transaction, usuarioId);
        return transaction.usuario.update({
          where: { id: usuarioId },
          data: { ativo: false },
          select: this.safeUserSelect,
        });
      }

      await this.validateActiveProjects(transaction, empresaId, projectIds);
      await transaction.usuarioProjeto.deleteMany({ where: { usuarioId } });
      await transaction.usuarioProjeto.createMany({
        data: projectAccesses.map((acesso) => ({ usuarioId, ...acesso })),
      });

      return transaction.usuario.findUniqueOrThrow({
        where: { id: usuarioId },
        select: this.safeUserSelect,
      });
    });
  }

  private readonly safeUserSelect = {
    id: true,
    empresaId: true,
    nome: true,
    email: true,
    papel: true,
    ativo: true,
    deveAlterarSenha: true,
    criadoEm: true,
    atualizadoEm: true,
  } satisfies Prisma.UsuarioSelect;

  private getCompanyId(user: AuthenticatedUser) {
    if (!user.empresaId) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return user.empresaId;
  }

  private async requireScopedUser(
    usuarioId: string,
    empresaId: string,
    client: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const user = await client.usuario.findFirst({
      where: { id: usuarioId, empresaId },
      select: { id: true, papel: true, ativo: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  private async validateActiveProjects(
    client: Prisma.TransactionClient,
    empresaId: string,
    projectIds: string[],
  ) {
    if (projectIds.length === 0) {
      throw new BadRequestException('Selecione ao menos um projeto ativo.');
    }

    const count = await client.projeto.count({
      where: {
        id: { in: projectIds },
        empresaId,
        status: StatusProjeto.ATIVO,
      },
    });

    if (count !== projectIds.length) {
      throw new BadRequestException(
        'Um ou mais projetos são inválidos, arquivados ou pertencem a outra empresa.',
      );
    }
  }

  private revokeSessions(client: Prisma.TransactionClient, usuarioId: string) {
    return client.sessao.updateMany({
      where: { usuarioId, revogadoEm: null },
      data: { revogadoEm: new Date() },
    });
  }

  private uniqueIds(ids: string[]) {
    return [...new Set(ids)];
  }

  private uniqueProjectAccesses(accesses: ProjectAccessDto[]) {
    return [
      ...new Map(accesses.map((access) => [access.projetoId, access])).values(),
    ];
  }

  private handleUniqueConstraint(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('E-mail já cadastrado.');
    }
  }
}
