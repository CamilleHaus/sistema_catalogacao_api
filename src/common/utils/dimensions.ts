import { BadRequestException } from '@nestjs/common';
import type { UnidadeMedida } from '@prisma/client';

export type DimensionInput = {
  altura?: number;
  largura?: number;
  profundidade?: number;
  unidade?: UnidadeMedida;
  descricaoVariavel?: string;
};

export function validateDimensionInput(dto: DimensionInput) {
  const hasDescription = Boolean(dto.descricaoVariavel?.trim());
  const hasAnyNumber =
    dto.altura !== undefined ||
    dto.largura !== undefined ||
    dto.profundidade !== undefined ||
    dto.unidade !== undefined;
  if (hasDescription && hasAnyNumber)
    throw new BadRequestException(
      'Use medidas numéricas ou descrição variável, nunca ambas.',
    );
  if (hasDescription)
    return {
      altura: null,
      largura: null,
      profundidade: null,
      unidade: null,
      descricaoVariavel: dto.descricaoVariavel!.trim(),
    };
  if (
    dto.altura === undefined ||
    dto.largura === undefined ||
    dto.unidade === undefined
  )
    throw new BadRequestException(
      'Altura, largura e unidade são obrigatórias na dimensão numérica.',
    );
  return {
    altura: dto.altura,
    largura: dto.largura,
    profundidade: dto.profundidade ?? null,
    unidade: dto.unidade,
    descricaoVariavel: null,
  };
}
