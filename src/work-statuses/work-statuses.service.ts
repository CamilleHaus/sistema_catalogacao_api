import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';
import type { StatusDto } from './dto/status.dto';

@Injectable()
export class WorkStatusesService {
  constructor(private readonly prisma: PrismaService) {}
  list(user: AuthenticatedUser) {
    return this.prisma.statusObra.findMany({
      where: { empresaId: this.companyId(user) },
      orderBy: { nome: 'asc' },
    });
  }
  async create(user: AuthenticatedUser, dto: StatusDto) {
    try {
      return await this.prisma.statusObra.create({
        data: { empresaId: this.companyId(user), nome: dto.nome.trim() },
      });
    } catch (error) {
      this.unique(error);
      throw error;
    }
  }
  async update(user: AuthenticatedUser, id: string, dto: StatusDto) {
    const item = await this.prisma.statusObra.findFirst({
      where: { id, empresaId: this.companyId(user) },
      select: { id: true },
    });
    if (!item) throw new NotFoundException('Status não encontrado.');
    try {
      return await this.prisma.statusObra.update({
        where: { id },
        data: { nome: dto.nome.trim() },
      });
    } catch (error) {
      this.unique(error);
      throw error;
    }
  }
  private companyId(user: AuthenticatedUser) {
    if (!user.empresaId) throw new NotFoundException('Empresa não encontrada.');
    return user.empresaId;
  }
  private unique(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    )
      throw new ConflictException(
        'Já existe um status com esse nome na empresa.',
      );
  }
}
