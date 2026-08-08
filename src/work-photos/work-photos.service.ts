import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WorkPhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async update(projetoId: string, obraId: string, rawUrl: string) {
    await this.requireWork(projetoId, obraId);
    return this.prisma.obra.update({
      where: { id: obraId },
      data: { fotoPrincipalUrl: rawUrl.trim() },
      select: { id: true, fotoPrincipalUrl: true, atualizadoEm: true },
    });
  }

  async remove(projetoId: string, obraId: string) {
    await this.requireWork(projetoId, obraId);
    return this.prisma.obra.update({
      where: { id: obraId },
      data: { fotoPrincipalUrl: null },
      select: { id: true, fotoPrincipalUrl: true, atualizadoEm: true },
    });
  }

  private async requireWork(projetoId: string, obraId: string) {
    const work = await this.prisma.obra.findFirst({
      where: { id: obraId, projetoId },
      select: { id: true },
    });
    if (!work) throw new NotFoundException('Obra não encontrada.');
  }
}
