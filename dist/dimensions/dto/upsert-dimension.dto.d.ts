import { UnidadeMedida } from '@prisma/client';
export declare class UpsertDimensionDto {
    altura?: number;
    largura?: number;
    profundidade?: number;
    unidade?: UnidadeMedida;
    descricaoVariavel?: string;
}
