import { AdvancedSearchService } from '../advanced-search/advanced-search.service';
import { PrismaService } from '../database/prisma.service';
import type { BulkEditDto } from './bulk-edit.dto';
export interface BulkResult {
    atualizadas: number;
    ignoradas: number;
    movimentacoes: number;
}
export declare class BulkEditService {
    private readonly prisma;
    private readonly search;
    constructor(prisma: PrismaService, search: AdvancedSearchService);
    fields(projetoId: string): Promise<{
        opcoes?: {
            value: string;
            label: string;
        }[] | undefined;
        id: string;
        label: string;
        grupo: string;
        tipo: import("./bulk-fields").BulkKind;
    }[]>;
    apply(projetoId: string, dto: BulkEditDto): Promise<BulkResult>;
    private validate;
    private assertOptions;
    private applyWork;
    private applyCatalog;
    private applyTransaction;
    private applyList;
    private ensureCatalogs;
    private locationPaths;
}
