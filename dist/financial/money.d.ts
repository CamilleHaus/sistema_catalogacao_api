import { Prisma, TipoDesconto } from '@prisma/client';
export declare function decimal(value?: string | Prisma.Decimal | null): Prisma.Decimal | null;
export declare function finalValue(valor: Prisma.Decimal | null, tipo: TipoDesconto | null, desconto: Prisma.Decimal | null): Prisma.Decimal | null;
