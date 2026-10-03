import { UnidadeMedida } from '@prisma/client';
export declare class SaveWorkSetDto {
    projetoId: string;
    codigo: string;
    descricao: string;
    imagemUrl?: string | null;
    altura?: number;
    largura?: number;
    profundidade?: number;
    unidade?: UnidadeMedida;
    descricaoVariavel?: string;
}
export declare class ListWorkSetsQueryDto {
    projetoId?: string;
}
