import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import type {
  CreateWorkAttachmentDto,
  CreateWorkImageDto,
  UpdateWorkAttachmentDto,
  UpdateWorkImageDto,
} from './dto/work-media.dto';

@Injectable()
export class WorkMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async gallery(projetoId: string, obraId: string) {
    await this.requireWork(projetoId, obraId);
    const [images, signatures] = await Promise.all([
      this.prisma.imagemObra.findMany({
        where: { obraId },
        orderBy: { criadoEm: 'desc' },
        include: { principalDe: { select: { id: true } } },
      }),
      this.prisma.assinatura.findMany({
        where: { catalogacao: { obraId }, imagemUrl: { not: null } },
        orderBy: { criadoEm: 'desc' },
        include: { localAssinatura: { select: { id: true, nome: true } } },
      }),
    ]);
    return {
      imagens: images.map(({ principalDe, ...image }) => ({
        ...image,
        principal: principalDe?.id === obraId,
      })),
      assinaturas: signatures,
    };
  }

  async createImage(
    projetoId: string,
    obraId: string,
    dto: CreateWorkImageDto,
  ) {
    await this.requireWork(projetoId, obraId);
    return this.prisma.imagemObra.create({
      data: {
        obraId,
        imagemUrl: dto.imagemUrl.trim(),
        creditos: this.text(dto.creditos),
        observacoes: this.text(dto.observacoes),
      },
    });
  }

  async updateImage(
    projetoId: string,
    obraId: string,
    id: string,
    dto: UpdateWorkImageDto,
  ) {
    await this.requireImage(projetoId, obraId, id);
    if (Object.values(dto).every((value) => value === undefined))
      throw new BadRequestException('Informe ao menos um campo.');
    return this.prisma.imagemObra.update({
      where: { id },
      data: this.imageData(dto),
    });
  }

  async setMain(projetoId: string, obraId: string, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const work = await tx.obra.findFirst({
        where: { id: obraId, projetoId },
        select: { id: true },
      });
      if (!work) throw new NotFoundException('Obra não encontrada.');
      const image = await tx.imagemObra.findFirst({
        where: { id, obraId },
        select: { id: true, imagemUrl: true },
      });
      if (!image) throw new NotFoundException('Imagem da obra não encontrada.');
      await tx.obra.update({
        where: { id: obraId },
        data: {
          imagemPrincipalId: image.id,
          fotoPrincipalUrl: image.imagemUrl,
        },
      });
      return { imagemId: image.id, principal: true };
    });
  }

  async removeImage(projetoId: string, obraId: string, id: string) {
    const removed = await this.prisma.$transaction(async (tx) => {
      const work = await tx.obra.findFirst({
        where: { id: obraId, projetoId },
        select: { imagemPrincipalId: true },
      });
      if (!work) throw new NotFoundException('Obra não encontrada.');
      const image = await tx.imagemObra.findFirst({
        where: { id, obraId },
        select: { id: true },
      });
      if (!image) throw new NotFoundException('Imagem da obra não encontrada.');
      if (work.imagemPrincipalId === id)
        await tx.obra.update({
          where: { id: obraId },
          data: { imagemPrincipalId: null, fotoPrincipalUrl: null },
        });
      return tx.imagemObra.delete({ where: { id } });
    });
    // Fora da transação: apagar o arquivo não deve derrubar a exclusão.
    await this.storage.removeByUrl(removed.imagemUrl);
    return removed;
  }

  async listAttachments(projetoId: string, obraId: string) {
    await this.requireWork(projetoId, obraId);
    const items = await this.prisma.anexoObra.findMany({
      where: { obraId },
      orderBy: { criadoEm: 'desc' },
    });
    return items;
  }

  async createAttachment(
    projetoId: string,
    obraId: string,
    dto: CreateWorkAttachmentDto,
  ) {
    await this.requireWork(projetoId, obraId);
    const item = await this.prisma.anexoObra.create({
      data: { obraId, ...this.attachmentData(dto) },
    });
    return item;
  }

  async updateAttachment(
    projetoId: string,
    obraId: string,
    id: string,
    dto: UpdateWorkAttachmentDto,
  ) {
    await this.requireAttachment(projetoId, obraId, id);
    const item = await this.prisma.anexoObra.update({
      where: { id },
      data: this.attachmentData(dto),
    });
    return item;
  }

  async removeAttachment(projetoId: string, obraId: string, id: string) {
    await this.requireAttachment(projetoId, obraId, id);
    return this.prisma.anexoObra.delete({ where: { id } });
  }

  private imageData(dto: UpdateWorkImageDto) {
    return {
      ...(dto.imagemUrl === undefined
        ? {}
        : { imagemUrl: dto.imagemUrl.trim() }),
      ...(dto.creditos === undefined
        ? {}
        : { creditos: this.text(dto.creditos) }),
      ...(dto.observacoes === undefined
        ? {}
        : { observacoes: this.text(dto.observacoes) }),
    };
  }
  private attachmentData(dto: CreateWorkAttachmentDto) {
    const pathname = new URL(dto.arquivoUrl).pathname;
    const filename = pathname.slice(pathname.lastIndexOf('/') + 1);
    const dot = filename.lastIndexOf('.');
    return {
      arquivoUrl: dto.arquivoUrl.trim(),
      tipo: dto.tipo,
      observacoes: this.text(dto.observacoes),
      extensao:
        dot > 0 && dot < filename.length - 1
          ? filename.slice(dot + 1).toLowerCase()
          : null,
    };
  }
  private async requireWork(projetoId: string, obraId: string) {
    const item = await this.prisma.obra.findFirst({
      where: { id: obraId, projetoId },
      select: { id: true },
    });
    if (!item) throw new NotFoundException('Obra não encontrada.');
    return item;
  }
  private async requireImage(projetoId: string, obraId: string, id: string) {
    await this.requireWork(projetoId, obraId);
    const item = await this.prisma.imagemObra.findFirst({
      where: { id, obraId },
      select: { id: true },
    });
    if (!item) throw new NotFoundException('Imagem da obra não encontrada.');
    return item;
  }
  private async requireAttachment(
    projetoId: string,
    obraId: string,
    id: string,
  ) {
    await this.requireWork(projetoId, obraId);
    const item = await this.prisma.anexoObra.findFirst({
      where: { id, obraId },
      select: { id: true },
    });
    if (!item) throw new NotFoundException('Anexo não encontrado.');
    return item;
  }
  private text(value?: string | null) {
    const text = value?.trim();
    return text || null;
  }
}
