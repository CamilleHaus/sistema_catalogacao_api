import assert from 'node:assert/strict';
import test from 'node:test';
import { Prisma, TipoDesconto } from '@prisma/client';
import { decimal, finalValue } from '../src/financial/money';

void test('calcula valores finais com Decimal', () => {
  assert.equal(finalValue(null, null, null), null);
  assert.equal(finalValue(decimal('100'), null, null)?.toFixed(2), '100.00');
  assert.equal(
    finalValue(
      decimal('100'),
      TipoDesconto.VALOR_FIXO,
      decimal('7.50'),
    )?.toFixed(2),
    '92.50',
  );
  assert.equal(
    finalValue(
      decimal('100'),
      TipoDesconto.PERCENTUAL,
      decimal('7.5'),
    )?.toFixed(2),
    '92.50',
  );
  assert.equal(
    finalValue(
      decimal('10.01'),
      TipoDesconto.PERCENTUAL,
      decimal('50'),
    )?.toFixed(2),
    '5.01',
  );
});

void test('rejeita valores e descontos inválidos', () => {
  assert.throws(() => decimal('-0.01'));
  assert.throws(() =>
    finalValue(new Prisma.Decimal(100), null, new Prisma.Decimal(1)),
  );
  assert.throws(() =>
    finalValue(
      new Prisma.Decimal(100),
      TipoDesconto.PERCENTUAL,
      new Prisma.Decimal(101),
    ),
  );
  assert.throws(() =>
    finalValue(
      new Prisma.Decimal(100),
      TipoDesconto.VALOR_FIXO,
      new Prisma.Decimal(101),
    ),
  );
});
