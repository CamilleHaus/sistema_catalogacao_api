import { Prisma } from '@prisma/client';
export type FieldType = 'texto' | 'numero' | 'valor' | 'data' | 'opcao' | 'multipla' | 'existe';
export type OptionSource = 'artistas' | 'status' | 'tecnicas' | 'localizacoes' | 'fichasMae' | 'categorias' | 'tags' | 'locaisAssinatura' | 'estadosConservacao' | 'tiposServico' | 'formasNegociacao' | 'modalidadesSeguro';
type Hop = [relation: string, many: boolean];
export interface SearchField {
    id: string;
    label: string;
    group: string;
    type: FieldType;
    column?: string;
    hops: Hop[];
    source?: OptionSource;
    enumOptions?: {
        value: string;
        label: string;
    }[];
    expandTree?: boolean;
    timestamp?: boolean;
    anyColumn?: string[];
}
export declare const OPERATORS: Record<FieldType, string[]>;
export declare const MOEDAS: {
    value: import("@prisma/client").$Enums.Moeda;
    label: string;
}[];
export declare const SEARCH_FIELDS: SearchField[];
export declare const FIELDS_BY_ID: Map<string, SearchField>;
export interface ResolvedCondition {
    field: SearchField;
    operator: string;
    value?: string | [string, string] | string[];
}
export declare function buildCondition({ field, operator, value, }: ResolvedCondition): Prisma.ObraWhereInput;
export {};
