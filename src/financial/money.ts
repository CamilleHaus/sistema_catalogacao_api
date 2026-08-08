import { BadRequestException } from '@nestjs/common';
import { Prisma, TipoDesconto } from '@prisma/client';

export function decimal(value?: string | Prisma.Decimal | null) {
  if (value === null || value === undefined || value === '') return null;
  const result = new Prisma.Decimal(value);
  if (result.isNegative())
    throw new BadRequestException('Valores negativos não são permitidos.');
  return result;
}

export function finalValue(
  valor: Prisma.Decimal | null,
  tipo: TipoDesconto | null,
  desconto: Prisma.Decimal | null,
) {
  if (!valor) return null;
  if (!desconto) return valor.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
  if (!tipo) throw new BadRequestException('Informe o tipo de desconto.');
  if (tipo === TipoDesconto.PERCENTUAL && desconto.greaterThan(100))
    throw new BadRequestException(
      'O desconto percentual deve estar entre 0 e 100.',
    );
  if (tipo === TipoDesconto.VALOR_FIXO && desconto.greaterThan(valor))
    throw new BadRequestException(
      'O desconto fixo não pode superar o valor principal.',
    );
  const result =
    tipo === TipoDesconto.VALOR_FIXO
      ? valor.minus(desconto)
      : valor.minus(valor.times(desconto).dividedBy(100));
  return result.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}
