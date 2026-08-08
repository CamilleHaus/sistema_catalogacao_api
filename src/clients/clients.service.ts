import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';
import type { CreateClientDto } from './dto/create-client.dto';
import type { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  list(currentUser: AuthenticatedUser) {
    return this.prisma.cliente.findMany({
      where: { empresaId: this.getCompanyId(currentUser) },
      include: { _count: { select: { projetos: true } } },
      orderBy: { nome: 'asc' },
    });
  }

  async create(currentUser: AuthenticatedUser, dto: CreateClientDto) {
    try {
      return await this.prisma.cliente.create({
        data: {
          empresaId: this.getCompanyId(currentUser),
          nome: dto.nome.trim(),
          descricao: this.normalizeDescription(dto.descricao),
          codigo: dto.codigo.trim().toUpperCase(),
        },
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  async findOne(currentUser: AuthenticatedUser, clienteId: string) {
    const cliente = await this.prisma.cliente.findFirst({
      where: { id: clienteId, empresaId: this.getCompanyId(currentUser) },
      include: {
        projetos: {
          select: { id: true, nome: true, status: true },
          orderBy: { nome: 'asc' },
        },
      },
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    return cliente;
  }

  async update(
    currentUser: AuthenticatedUser,
    clienteId: string,
    dto: UpdateClientDto,
  ) {
    if (dto.nome === undefined && dto.descricao === undefined) {
      throw new BadRequestException(
        'Informe nome ou descrição para atualização.',
      );
    }

    const cliente = await this.prisma.cliente.findFirst({
      where: { id: clienteId, empresaId: this.getCompanyId(currentUser) },
      select: { id: true },
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');

    return this.prisma.cliente.update({
      where: { id: cliente.id },
      data: {
        ...(dto.nome === undefined ? {} : { nome: dto.nome.trim() }),
        ...(dto.descricao === undefined
          ? {}
          : { descricao: this.normalizeDescription(dto.descricao) }),
      },
    });
  }

  private getCompanyId(user: AuthenticatedUser) {
    if (!user.empresaId) throw new NotFoundException('Empresa não encontrada.');
    return user.empresaId;
  }

  private normalizeDescription(description?: string | null) {
    const normalized = description?.trim();
    return normalized ? normalized : null;
  }

  private handleUniqueConstraint(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Já existe um cliente com esse código na empresa.',
      );
    }
  }
}
