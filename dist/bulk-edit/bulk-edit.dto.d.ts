export declare class BulkMovementDto {
    registrar: boolean;
    data?: string | null;
    realizadoPor?: string | null;
    observacoes?: string | null;
}
export declare class BulkEditDto {
    obraIds: string[];
    campo: string;
    valor?: unknown;
    modo?: 'adicionar' | 'remover' | 'substituir';
    movimentacao?: BulkMovementDto;
}
