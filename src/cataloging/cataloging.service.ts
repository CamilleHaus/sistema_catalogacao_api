import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type {
  CreateCertificateDto,
  CreateSignatureDto,
  SaveCatalogingDto,
} from './dto/cataloging.dto';

@Injectable()
export class CatalogingService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly include = {
    categoria: true,
    tags: {
      include: { tag: true },
      orderBy: { tag: { nome: 'asc' as const } },
    },
    assinaturas: {
      include: { localAssinatura: true },
      orderBy: { criadoEm: 'asc' as const },
    },
    certificados: { orderBy: { criadoEm: 'asc' as const } },
  };
  async get(projetoId: string, obraId: string) {
    await this.context(projetoId, obraId);
    const item = await this.prisma.catalogacao.findUnique({
      where: { obraId },
      include: this.include,
    });
    return item ? this.present(item) : null;
  }
  async save(projetoId: string, obraId: string, dto: SaveCatalogingDto) {
    const context = await this.context(projetoId, obraId);
    const tagIds =
      dto.tagIds === undefined ? undefined : [...new Set(dto.tagIds)];
    await this.validateReferences(context.empresaId, dto.categoriaId, tagIds);
    const scalar = {
      ...(dto.categoriaId === undefined
        ? {}
        : { categoriaId: dto.categoriaId || null }),
      ...(dto.proveniencia === undefined
        ? {}
        : { proveniencia: this.text(dto.proveniencia) }),
      ...(dto.observacoes === undefined
        ? {}
        : { observacoes: this.text(dto.observacoes) }),
    };
    const item = await this.prisma.$transaction(async (tx) => {
      const catalog = await tx.catalogacao.upsert({
        where: { obraId },
        create: { obraId, ...scalar },
        update: scalar,
      });
      if (tagIds !== undefined) {
        await tx.catalogacaoTag.deleteMany({
          where: { catalogacaoId: catalog.id },
        });
        if (tagIds.length)
          await tx.catalogacaoTag.createMany({
            data: tagIds.map((tagId) => ({ catalogacaoId: catalog.id, tagId })),
          });
      }
      return tx.catalogacao.findUniqueOrThrow({
        where: { id: catalog.id },
        include: this.include,
      });
    });
    return this.present(item);
  }
  async addSignature(
    projetoId: string,
    obraId: string,
    dto: CreateSignatureDto,
  ) {
    const { catalog, empresaId } = await this.requireCatalog(projetoId, obraId);
    await this.validLocation(dto.localAssinaturaId, empresaId);
    return this.prisma.assinatura.create({
      data: {
        catalogacaoId: catalog.id,
        localAssinaturaId: dto.localAssinaturaId,
        imagemUrl: this.text(dto.imagemUrl),
      },
      include: { localAssinatura: true },
    });
  }
  async updateSignature(
    projetoId: string,
    obraId: string,
    id: string,
    dto: CreateSignatureDto,
  ) {
    const { catalog, empresaId } = await this.requireCatalog(projetoId, obraId);
    await this.validLocation(dto.localAssinaturaId, empresaId);
    await this.requireChild('assinatura', id, catalog.id);
    return this.prisma.assinatura.update({
      where: { id },
      data: {
        localAssinaturaId: dto.localAssinaturaId,
        imagemUrl: this.text(dto.imagemUrl),
      },
      include: { localAssinatura: true },
    });
  }
  async removeSignature(projetoId: string, obraId: string, id: string) {
    const { catalog } = await this.requireCatalog(projetoId, obraId);
    await this.requireChild('assinatura', id, catalog.id);
    return this.prisma.assinatura.delete({ where: { id } });
  }
  async addCertificate(
    projetoId: string,
    obraId: string,
    dto: CreateCertificateDto,
  ) {
    const { catalog } = await this.requireCatalog(projetoId, obraId);
    return this.prisma.certificado.create({
      data: {
        catalogacaoId: catalog.id,
        imagemUrl: dto.imagemUrl.trim(),
        observacoes: this.text(dto.observacoes),
      },
    });
  }
  async updateCertificate(
    projetoId: string,
    obraId: string,
    id: string,
    dto: CreateCertificateDto,
  ) {
    const { catalog } = await this.requireCatalog(projetoId, obraId);
    await this.requireChild('certificado', id, catalog.id);
    return this.prisma.certificado.update({
      where: { id },
      data: {
        imagemUrl: dto.imagemUrl.trim(),
        observacoes: this.text(dto.observacoes),
      },
    });
  }
  async removeCertificate(projetoId: string, obraId: string, id: string) {
    const { catalog } = await this.requireCatalog(projetoId, obraId);
    await this.requireChild('certificado', id, catalog.id);
    return this.prisma.certificado.delete({ where: { id } });
  }
  private async context(projetoId: string, obraId: string) {
    const work = await this.prisma.obra.findFirst({
      where: { id: obraId, projetoId },
      select: { id: true, projeto: { select: { empresaId: true } } },
    });
    if (!work) throw new NotFoundException('Obra não encontrada.');
    return { empresaId: work.projeto.empresaId };
  }
  private async requireCatalog(projetoId: string, obraId: string) {
    const { empresaId } = await this.context(projetoId, obraId);
    const catalog = await this.prisma.catalogacao.findUnique({
      where: { obraId },
      select: { id: true },
    });
    if (!catalog)
      throw new BadRequestException(
        'Crie a catalogação da obra antes de adicionar registros.',
      );
    return { catalog, empresaId };
  }
  private async validateReferences(
    empresaId: string,
    categoriaId?: string | null,
    tagIds?: string[],
  ) {
    if (
      categoriaId &&
      !(await this.prisma.categoriaCatalogacao.findFirst({
        where: { id: categoriaId, empresaId },
      }))
    )
      throw new BadRequestException(
        'Categoria inválida para a empresa da obra.',
      );
    if (
      tagIds?.length &&
      (await this.prisma.tag.count({
        where: { id: { in: tagIds }, empresaId },
      })) !== tagIds.length
    )
      throw new BadRequestException(
        'Uma ou mais tags são inválidas para a empresa da obra.',
      );
  }
  private async validLocation(id: string, empresaId: string) {
    if (
      !(await this.prisma.localAssinatura.findFirst({
        where: { id, empresaId },
      }))
    )
      throw new BadRequestException(
        'Local de assinatura inválido para a empresa da obra.',
      );
  }
  private async requireChild(
    kind: 'assinatura' | 'certificado',
    id: string,
    catalogacaoId: string,
  ) {
    const found =
      kind === 'assinatura'
        ? await this.prisma.assinatura.findFirst({
            where: { id, catalogacaoId },
          })
        : await this.prisma.certificado.findFirst({
            where: { id, catalogacaoId },
          });
    if (!found) throw new NotFoundException('Registro não encontrado.');
  }
  private text(value?: string | null) {
    const result = value?.trim();
    return result || null;
  }
  private present<T extends { tags: { tag: unknown }[] }>(item: T) {
    const { tags, ...rest } = item;
    return { ...rest, tags: tags.map(({ tag }) => tag) };
  }
}
