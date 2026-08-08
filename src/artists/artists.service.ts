import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AuthorizationService } from '../auth/authorization.service';
import { PrismaService } from '../database/prisma.service';
import type { CreateArtistDto } from './dto/create-artist.dto';
import type { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authorization: AuthorizationService,
  ) {}
  list(user: AuthenticatedUser) {
    return this.prisma.artista.findMany({
      where: { empresaId: this.companyId(user) },
      orderBy: { nome: 'asc' },
    });
  }
  async findOne(user: AuthenticatedUser, id: string) {
    const item = await this.prisma.artista.findFirst({
      where: { id, empresaId: this.companyId(user) },
    });
    if (!item) throw new NotFoundException('Artista não encontrado.');
    return item;
  }
  async create(user: AuthenticatedUser, dto: CreateArtistDto) {
    await this.authorization.assertCompanyEditor(user);
    return this.prisma.artista.create({
      data: {
        empresaId: this.companyId(user),
        ...this.data(dto),
        nome: dto.nome.trim(),
      },
    });
  }
  async update(user: AuthenticatedUser, id: string, dto: UpdateArtistDto) {
    await this.authorization.assertCompanyEditor(user);
    if (Object.values(dto).every((value) => value === undefined))
      throw new BadRequestException(
        'Informe ao menos um campo para atualização.',
      );
    await this.findOne(user, id);
    return this.prisma.artista.update({ where: { id }, data: this.data(dto) });
  }
  private companyId(user: AuthenticatedUser) {
    if (!user.empresaId) throw new NotFoundException('Empresa não encontrada.');
    return user.empresaId;
  }
  private data(dto: CreateArtistDto | UpdateArtistDto) {
    return {
      ...(dto.nome === undefined ? {} : { nome: dto.nome.trim() }),
      ...(dto.localNascimento === undefined
        ? {}
        : { localNascimento: dto.localNascimento?.trim() || null }),
      ...(dto.anoNascimento === undefined
        ? {}
        : { anoNascimento: dto.anoNascimento }),
      ...(dto.localFalecimento === undefined
        ? {}
        : { localFalecimento: dto.localFalecimento?.trim() || null }),
      ...(dto.anoFalecimento === undefined
        ? {}
        : { anoFalecimento: dto.anoFalecimento }),
    };
  }
}
