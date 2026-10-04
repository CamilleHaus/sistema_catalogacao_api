import { type OptionSource } from '../advanced-search/search-fields';
export type BulkKind = 'texto' | 'inteiro' | 'opcao' | 'lista';
export type BulkTarget = 'obra' | 'catalogacao' | 'aquisicao' | 'venda';
export interface BulkField {
    id: string;
    label: string;
    group: string;
    kind: BulkKind;
    target: BulkTarget;
    column: string;
    source?: OptionSource;
    enumOptions?: {
        value: string;
        label: string;
    }[];
}
export declare const BULK_FIELDS: BulkField[];
export declare const BULK_FIELDS_BY_ID: Map<string, BulkField>;
