import { CombinacaoFiltro } from '@prisma/client';
export declare const MAX_CONDITIONS = 30;
export declare class SearchConditionDto {
    campo: string;
    operador: string;
    valor?: unknown;
}
export declare class AdvancedSearchDto {
    combinar: CombinacaoFiltro;
    condicoes: SearchConditionDto[];
}
export declare class SaveSearchFilterDto extends AdvancedSearchDto {
    nome: string;
}
