import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type {
  AddPublicationImageDto,
  SaveCurriculumDto,
  SaveMuseumResearchDto,
  SavePublicationDto,
} from './dto/research.dto';

@Injectable()
export class ResearchService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projetoId: string, obraId: string) {
    await this.requireWork(projetoId, obraId);
    const [curriculos, publicacoes, pesquisasMuseologicas] = await Promise.all([
      this.prisma.curriculoObra.findMany({
        where: { obraId },
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.publicacao.findMany({
        where: { obraId },
        include: { imagens: { orderBy: { criadoEm: 'asc' } } },
        orderBy: [
          { ano: { sort: 'desc', nulls: 'last' } },
          { criadoEm: 'desc' },
        ],
      }),
      this.prisma.pesquisaMuseologica.findMany({
        where: { obraId },
        orderBy: { criadoEm: 'desc' },
      }),
    ]);
    return { curriculos, publicacoes, pesquisasMuseologicas };
  }

  async createCurriculum(
    projetoId: string,
    obraId: string,
    dto: SaveCurriculumDto,
  ) {
    await this.requireWork(projetoId, obraId);
    return this.prisma.curriculoObra.create({
      data: { obraId, ...this.curriculumData(dto) },
    });
  }

  async updateCurriculum(
    projetoId: string,
    obraId: string,
    id: string,
    dto: SaveCurriculumDto,
  ) {
    await this.requireChild(projetoId, obraId, 'curriculo', id);
    return this.prisma.curriculoObra.update({
      where: { id },
      data: this.curriculumData(dto, true),
    });
  }

  async removeCurriculum(projetoId: string, obraId: string, id: string) {
    await this.requireChild(projetoId, obraId, 'curriculo', id);
    return this.prisma.curriculoObra.delete({ where: { id } });
  }

  async createPublication(
    projetoId: string,
    obraId: string,
    dto: SavePublicationDto,
  ) {
    await this.requireWork(projetoId, obraId);
    return this.prisma.$transaction(async (tx) => {
      return tx.publicacao.create({
        data: {
          obraId,
          ...this.publicationData(dto),
          imagens: dto.imagens?.length
            ? {
                create: dto.imagens.map((imagemUrl) => ({
                  imagemUrl: imagemUrl.trim(),
                })),
              }
            : undefined,
        },
        include: { imagens: { orderBy: { criadoEm: 'asc' } } },
      });
    });
  }

  async updatePublication(
    projetoId: string,
    obraId: string,
    id: string,
    dto: SavePublicationDto,
  ) {
    await this.requireChild(projetoId, obraId, 'publicacao', id);
    return this.prisma.publicacao.update({
      where: { id },
      data: this.publicationData(dto, true),
      include: { imagens: { orderBy: { criadoEm: 'asc' } } },
    });
  }

  async removePublication(projetoId: string, obraId: string, id: string) {
    await this.requireChild(projetoId, obraId, 'publicacao', id);
    return this.prisma.publicacao.delete({ where: { id } });
  }

  async addPublicationImage(
    projetoId: string,
    obraId: string,
    publicationId: string,
    dto: AddPublicationImageDto,
  ) {
    await this.requireChild(projetoId, obraId, 'publicacao', publicationId);
    return this.prisma.imagemPublicacao.create({
      data: { publicacaoId: publicationId, imagemUrl: dto.imagemUrl.trim() },
    });
  }

  async removePublicationImage(
    projetoId: string,
    obraId: string,
    publicationId: string,
    imageId: string,
  ) {
    await this.requireChild(projetoId, obraId, 'publicacao', publicationId);
    const image = await this.prisma.imagemPublicacao.findFirst({
      where: { id: imageId, publicacaoId: publicationId },
      select: { id: true },
    });
    if (!image) throw new NotFoundException('Imagem não encontrada.');
    return this.prisma.imagemPublicacao.delete({ where: { id: imageId } });
  }

  async createMuseumResearch(
    projetoId: string,
    obraId: string,
    dto: SaveMuseumResearchDto,
  ) {
    await this.requireWork(projetoId, obraId);
    const data = this.museumData(dto);
    this.validateMuseumContent(data.descricao, data.url);
    return this.prisma.pesquisaMuseologica.create({
      data: { obraId, ...data },
    });
  }

  async updateMuseumResearch(
    projetoId: string,
    obraId: string,
    id: string,
    dto: SaveMuseumResearchDto,
  ) {
    await this.requireWork(projetoId, obraId);
    const existing = await this.prisma.pesquisaMuseologica.findFirst({
      where: { id, obraId },
    });
    if (!existing) throw new NotFoundException('Registro não encontrado.');
    const data = this.museumData(dto, true);
    this.validateMuseumContent(
      data.descricao === undefined ? existing.descricao : data.descricao,
      data.url === undefined ? existing.url : data.url,
    );
    return this.prisma.pesquisaMuseologica.update({ where: { id }, data });
  }

  async removeMuseumResearch(projetoId: string, obraId: string, id: string) {
    await this.requireChild(projetoId, obraId, 'pesquisa', id);
    return this.prisma.pesquisaMuseologica.delete({ where: { id } });
  }

  private async requireWork(projetoId: string, obraId: string) {
    const work = await this.prisma.obra.findFirst({
      where: { id: obraId, projetoId },
      select: { id: true },
    });
    if (!work) throw new NotFoundException('Obra não encontrada.');
  }

  private async requireChild(
    projetoId: string,
    obraId: string,
    kind: 'curriculo' | 'publicacao' | 'pesquisa',
    id: string,
  ) {
    await this.requireWork(projetoId, obraId);
    const item =
      kind === 'curriculo'
        ? await this.prisma.curriculoObra.findFirst({ where: { id, obraId } })
        : kind === 'publicacao'
          ? await this.prisma.publicacao.findFirst({ where: { id, obraId } })
          : await this.prisma.pesquisaMuseologica.findFirst({
              where: { id, obraId },
            });
    if (!item) throw new NotFoundException('Registro não encontrado.');
    return item;
  }

  private curriculumData(dto: SaveCurriculumDto, partial = false) {
    return this.optionalData(
      dto,
      ['nomeExposicao', 'instituicao', 'cidade', 'pais', 'data'],
      partial,
    );
  }
  private publicationData(dto: SavePublicationDto, partial = false) {
    return {
      ...this.optionalData(
        dto,
        ['titulo', 'autor', 'editora', 'pagina'],
        partial,
      ),
      ...(!partial || dto.ano !== undefined ? { ano: dto.ano ?? null } : {}),
    };
  }
  private museumData(dto: SaveMuseumResearchDto, partial = false) {
    return this.optionalData(dto, ['titulo', 'descricao', 'url'], partial);
  }
  private optionalData<T extends object, K extends keyof T>(
    dto: T,
    keys: K[],
    partial: boolean,
  ) {
    return Object.fromEntries(
      keys.flatMap((key) => {
        const value = dto[key];
        if (partial && value === undefined) return [];
        return [[key, this.text(value as string | null | undefined)]];
      }),
    ) as { [P in K]?: string | null };
  }
  private text(value?: string | null) {
    return value?.trim() || null;
  }
  private validateMuseumContent(
    descricao?: string | null,
    url?: string | null,
  ) {
    if (!descricao?.trim() && !url?.trim()) {
      throw new BadRequestException('Informe uma descrição, uma URL ou ambos.');
    }
  }
}
