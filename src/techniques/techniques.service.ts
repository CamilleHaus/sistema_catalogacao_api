import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PapelUsuario, Prisma } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AuthorizationService } from '../auth/authorization.service';
import { PrismaService } from '../database/prisma.service';
import type { CreateTechniqueDto } from './dto/create-technique.dto';
import type { ListTechniquesQueryDto } from './dto/list-techniques-query.dto';
import type { UpdateTechniqueDto } from './dto/update-technique.dto';

@Injectable()
export class TechniquesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authorization: AuthorizationService,
  ) {}

  async list(user: AuthenticatedUser, query: ListTechniquesQueryDto) {
    const empresaId = this.companyId(user);
    if (query.projetoId)
      await this.authorization.assertProjectAccess(user, query.projetoId);
    return this.prisma.tecnica.findMany({
      where: {
        empresaId,
        ...(query.projetoId
          ? { OR: [{ projetoId: null }, { projetoId: query.projetoId }] }
          : user.papel === PapelUsuario.ADMIN_EMPRESA
            ? {}
            : { projetoId: null }),
      },
      include: { projeto: { select: { id: true, nome: true } } },
      orderBy: [{ projetoId: 'asc' }, { nome: 'asc' }],
    });
  }

  async create(user: AuthenticatedUser, dto: CreateTechniqueDto) {
    const empresaId = this.companyId(user);
    if (dto.projetoId) {
      const project = await this.prisma.projeto.findFirst({
        where: { id: dto.projetoId, empresaId },
        select: { id: true },
      });
      if (!project)
        throw new BadRequestException(
          'Projeto inválido ou pertencente a outra empresa.',
        );
    }
    try {
      return await this.prisma.tecnica.create({
        data: {
          empresaId,
          projetoId: dto.projetoId ?? null,
          nome: dto.nome.trim(),
        },
        include: { projeto: { select: { id: true, nome: true } } },
      });
    } catch (error) {
      this.unique(error);
      throw error;
    }
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateTechniqueDto) {
    const item = await this.prisma.tecnica.findFirst({
      where: { id, empresaId: this.companyId(user) },
      select: { id: true },
    });
    if (!item) throw new NotFoundException('Técnica não encontrada.');
    try {
      return await this.prisma.tecnica.update({
        where: { id },
        data: { nome: dto.nome.trim() },
        include: { projeto: { select: { id: true, nome: true } } },
      });
    } catch (error) {
      this.unique(error);
      throw error;
    }
  }

  private companyId(user: AuthenticatedUser) {
    if (!user.empresaId || user.papel === PapelUsuario.ADMIN_GLOBAL)
      throw new NotFoundException('Empresa não encontrada.');
    return user.empresaId;
  }
  private unique(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    )
      throw new ConflictException(
        'Já existe uma técnica com esse nome nesse escopo.',
      );
  }
}
