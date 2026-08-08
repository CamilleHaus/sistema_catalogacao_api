import type { UnidadeMedida } from '@prisma/client';
export type DimensionInput = {
    altura?: number;
    largura?: number;
    profundidade?: number;
    unidade?: UnidadeMedida;
    descricaoVariavel?: string;
};
export declare function validateDimensionInput(dto: DimensionInput): {
    altura: null;
    largura: null;
    profundidade: null;
    unidade: null;
    descricaoVariavel: string;
} | {
    altura: number;
    largura: number;
    profundidade: number | null;
    unidade: import("@prisma/client").$Enums.UnidadeMedida;
    descricaoVariavel: null;
};
