export declare class SaveCatalogingDto {
    categoriaId?: string | null;
    proveniencia?: string | null;
    observacoes?: string | null;
    tagIds?: string[];
}
export declare class SaveNameDto {
    nome: string;
}
export declare class SaveTagDto extends SaveNameDto {
    cor?: string | null;
}
export declare class CreateSignatureDto {
    localAssinaturaId: string;
    imagemUrl?: string | null;
}
export declare class CreateCertificateDto {
    imagemUrl: string;
    observacoes?: string | null;
}
