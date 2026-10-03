import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class WorkPhotosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async update(
    projetoId: string,
    obraId: string,
    rawUrl: string,
    rawCredits?: string | null,
  ) {
    await this.requireWork(projetoId, obraId);
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.obra.findUniqueOrThrow({
        where: { id: obraId },
        select: { imagemPrincipal: { select: { id: true, imagemUrl: true } } },
      });
      const normalizedUrl = rawUrl.trim();
      const credits = rawCredits?.trim() || null;
      if (current.imagemPrincipal?.imagemUrl === normalizedUrl) {
        await tx.imagemObra.update({
          where: { id: current.imagemPrincipal.id },
          data: { creditos: credits },
        });
        return tx.obra.findUniqueOrThrow({
          where: { id: obraId },
          select: {
            id: true,
            fotoPrincipalUrl: true,
            imagemPrincipalId: true,
            imagemPrincipal: true,
            atualizadoEm: true,
          },
        });
      }
      const image = await tx.imagemObra.create({
        data: {
          obraId,
          imagemUrl: normalizedUrl,
          creditos: credits,
        },
      });
      return tx.obra.update({
        where: { id: obraId },
        data: {
          fotoPrincipalUrl: image.imagemUrl,
          imagemPrincipalId: image.id,
        },
        select: {
          id: true,
          fotoPrincipalUrl: true,
          imagemPrincipalId: true,
          imagemPrincipal: true,
          atualizadoEm: true,
        },
      });
    });
  }

  async remove(projetoId: string, obraId: string) {
    await this.requireWork(projetoId, obraId);
    const { result, urlRemovida } = await this.prisma.$transaction(
      async (tx) => {
        const work = await tx.obra.findUniqueOrThrow({
          where: { id: obraId },
          select: { imagemPrincipal: { select: { id: true, imagemUrl: true } } },
        });
        const result = await tx.obra.update({
          where: { id: obraId },
          data: { fotoPrincipalUrl: null, imagemPrincipalId: null },
          select: {
            id: true,
            fotoPrincipalUrl: true,
            imagemPrincipalId: true,
            atualizadoEm: true,
          },
        });
        if (work.imagemPrincipal)
          await tx.imagemObra.delete({ where: { id: work.imagemPrincipal.id } });
        return { result, urlRemovida: work.imagemPrincipal?.imagemUrl ?? null };
      },
    );
    // Fora da transação: apagar o arquivo não deve derrubar a exclusão.
    if (urlRemovida) await this.storage.removeByUrl(urlRemovida);
    return result;
  }

  private async requireWork(projetoId: string, obraId: string) {
    const work = await this.prisma.obra.findFirst({
      where: { id: obraId, projetoId },
      select: { id: true },
    });
    if (!work) throw new NotFoundException('Obra não encontrada.');
  }
}
