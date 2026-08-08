import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PapelUsuario, Prisma } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AuthorizationService } from '../auth/authorization.service';
import { PrismaService } from '../database/prisma.service';
import type { SaveNameDto, SaveTagDto } from './dto/cataloging.dto';

@Injectable()
export class ReferenceDataService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authorization: AuthorizationService,
  ) {}
  private companyId(user: AuthenticatedUser) {
    if (!user.empresaId || user.papel === PapelUsuario.ADMIN_GLOBAL)
      throw new NotFoundException('Empresa não encontrada.');
    return user.empresaId;
  }
  list(
    user: AuthenticatedUser,
    kind: 'categoria' | 'tag' | 'local' | 'forma' | 'modalidade',
  ) {
    const where = { empresaId: this.companyId(user) };
    if (kind === 'categoria')
      return this.prisma.categoriaCatalogacao.findMany({
        where,
        orderBy: { nome: 'asc' },
      });
    if (kind === 'tag')
      return this.prisma.tag.findMany({ where, orderBy: { nome: 'asc' } });
    if (kind === 'local')
      return this.prisma.localAssinatura.findMany({
        where,
        orderBy: { nome: 'asc' },
      });
    return kind === 'forma'
      ? this.prisma.formaNegociacao.findMany({
          where,
          orderBy: { nome: 'asc' },
        })
      : this.prisma.modalidadeSeguro.findMany({
          where,
          orderBy: { nome: 'asc' },
        });
  }
  async create(
    user: AuthenticatedUser,
    kind: 'categoria' | 'tag' | 'local' | 'forma' | 'modalidade',
    dto: SaveNameDto | SaveTagDto,
  ) {
    await this.authorization.assertCompanyEditor(user);
    const data = { empresaId: this.companyId(user), nome: dto.nome.trim() };
    try {
      if (kind === 'categoria')
        return await this.prisma.categoriaCatalogacao.create({ data });
      if (kind === 'tag')
        return await this.prisma.tag.create({
          data: { ...data, cor: (dto as SaveTagDto).cor ?? null },
        });
      if (kind === 'local')
        return await this.prisma.localAssinatura.create({ data });
      return kind === 'forma'
        ? await this.prisma.formaNegociacao.create({ data })
        : await this.prisma.modalidadeSeguro.create({ data });
    } catch (error) {
      this.unique(error);
      throw error;
    }
  }
  async update(
    user: AuthenticatedUser,
    kind: 'categoria' | 'tag' | 'local' | 'forma' | 'modalidade',
    id: string,
    dto: SaveNameDto | SaveTagDto,
  ) {
    await this.authorization.assertCompanyEditor(user);
    const empresaId = this.companyId(user);
    const data = { nome: dto.nome.trim() };
    try {
      if (kind === 'categoria') {
        await this.require(
          this.prisma.categoriaCatalogacao.findFirst({
            where: { id, empresaId },
          }),
        );
        return await this.prisma.categoriaCatalogacao.update({
          where: { id },
          data,
        });
      }
      if (kind === 'tag') {
        await this.require(
          this.prisma.tag.findFirst({ where: { id, empresaId } }),
        );
        return await this.prisma.tag.update({
          where: { id },
          data: { ...data, cor: (dto as SaveTagDto).cor ?? null },
        });
      }
      if (kind === 'local') {
        await this.require(
          this.prisma.localAssinatura.findFirst({ where: { id, empresaId } }),
        );
        return await this.prisma.localAssinatura.update({
          where: { id },
          data,
        });
      }
      if (kind === 'forma') {
        await this.require(
          this.prisma.formaNegociacao.findFirst({ where: { id, empresaId } }),
        );
        return await this.prisma.formaNegociacao.update({
          where: { id },
          data,
        });
      }
      await this.require(
        this.prisma.modalidadeSeguro.findFirst({ where: { id, empresaId } }),
      );
      return await this.prisma.modalidadeSeguro.update({ where: { id }, data });
    } catch (error) {
      this.unique(error);
      throw error;
    }
  }
  private async require(value: Promise<unknown>) {
    if (!(await value)) throw new NotFoundException('Cadastro não encontrado.');
  }
  private unique(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    )
      throw new ConflictException(
        'Já existe um cadastro com esse nome na empresa.',
      );
  }
}
