import { UnidadeMedida } from '@prisma/client';

const INCH_IN_CM = 2.54;

export function convertMeasurement(value: number, from: UnidadeMedida) {
  const converted =
    from === UnidadeMedida.IN ? value * INCH_IN_CM : value / INCH_IN_CM;
  return {
    valor: Math.round((converted + Number.EPSILON) * 100) / 100,
    unidade: from === UnidadeMedida.IN ? UnidadeMedida.CM : UnidadeMedida.IN,
  };
}

export function presentDimension<
  T extends {
    altura: { toNumber(): number } | null;
    largura: { toNumber(): number } | null;
    profundidade: { toNumber(): number } | null;
    unidade: UnidadeMedida | null;
    descricaoVariavel: string | null;
  },
>(dimension: T) {
  if (!dimension.unidade) return { ...dimension, formato: 'VARIAVEL' as const };
  const altura = dimension.altura!.toNumber();
  const largura = dimension.largura!.toNumber();
  const profundidade = dimension.profundidade?.toNumber() ?? null;
  return {
    ...dimension,
    formato: 'NUMERICA' as const,
    altura,
    largura,
    profundidade,
    conversao: {
      altura: convertMeasurement(altura, dimension.unidade),
      largura: convertMeasurement(largura, dimension.unidade),
      profundidade:
        profundidade === null
          ? null
          : convertMeasurement(profundidade, dimension.unidade),
    },
  };
}
