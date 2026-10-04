import { Prisma } from '@prisma/client';
import type { OptionSource } from '../advanced-search/search-fields';
import { type SearchField } from '../advanced-search/search-fields';
export interface ExportField {
    id: string;
    label: string;
    group: string;
    hops: SearchField['hops'];
    read: (work: Row, ctx: ExportContext) => string;
}
export type Row = Record<string, any>;
export interface ExportContext {
    labels: Record<OptionSource, Map<string, string>>;
}
export declare const EXPORT_FIELDS: ExportField[];
export declare const EXPORT_FIELDS_BY_ID: Map<string, ExportField>;
export declare function includeFor(fields: ExportField[]): Prisma.ObraInclude;
