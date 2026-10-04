import { AdvancedSearchService } from '../advanced-search/advanced-search.service';
import { PrismaService } from '../database/prisma.service';
import type { ExportDto } from './export.dto';
import { StorageService } from '../storage/storage.service';
export interface ExportFile {
    filename: string;
    contentType: string;
    body: Buffer;
}
export declare class ExportsService {
    private readonly prisma;
    private readonly search;
    private readonly storage;
    constructor(prisma: PrismaService, search: AdvancedSearchService, storage: StorageService);
    fields(): {
        campos: {
            id: string;
            label: string;
            grupo: string;
        }[];
    };
    export(projetoId: string, usuarioId: string, dto: ExportDto): Promise<ExportFile>;
    private galleries;
    private recordImages;
    private convertImages;
    private image;
    private resolveScope;
    private context;
}
