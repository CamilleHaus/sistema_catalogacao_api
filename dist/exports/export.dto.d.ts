export declare class ExportScopeDto {
    tipo: 'obras' | 'filtro' | 'todas';
    obraIds?: string[];
    filtroId?: string;
}
export declare class ExportDto {
    formato: 'lista';
    saida: 'pdf' | 'csv';
    imagens?: boolean;
    escopo: ExportScopeDto;
    campos: string[];
}
