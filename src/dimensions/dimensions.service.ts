import { Injectable, NotFoundException } from '@nestjs/common';
import { TipoDimensao } from '@prisma/client';
import { presentDimension } from '../common/utils/measurements';
import { validateDimensionInput } from '../common/utils/dimensions';
import { PrismaService } from '../database/prisma.service';
import type { UpsertDimensionDto } from './dto/upsert-dimension.dto';

@Injectable()
export class DimensionsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(
    projetoId: string,
    obraId: string,
    tipo: TipoDimensao,
    dto: UpsertDimensionDto,
  ) {
    await this.requireWork(projetoId, obraId);
    const data = validateDimensionInput(dto);
    const dimension = await this.prisma.dimensaoObra.upsert({
      where: { obraId_tipo: { obraId, tipo } },
      create: { obraId, tipo, ...data },
      update: data,
    });
    return presentDimension(dimension);
  }

  async remove(projetoId: string, obraId: string, tipo: TipoDimensao) {
    await this.requireWork(projetoId, obraId);
    const result = await this.prisma.dimensaoObra.deleteMany({
      where: { obraId, tipo },
    });
    return { removida: result.count > 0 };
  }

  private async requireWork(projetoId: string, obraId: string) {
    const work = await this.prisma.obra.findFirst({
      where: { id: obraId, projetoId },
      select: { id: true },
    });
    if (!work) throw new NotFoundException('Obra não encontrada.');
  }
}
