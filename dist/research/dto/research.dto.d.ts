declare class OptionalTextDto {
    titulo?: string | null;
}
export declare class SaveCurriculumDto {
    nomeExposicao?: string | null;
    instituicao?: string | null;
    cidade?: string | null;
    pais?: string | null;
    data?: string | null;
}
export declare class SavePublicationDto extends OptionalTextDto {
    ano?: number | null;
    autor?: string | null;
    editora?: string | null;
    pagina?: string | null;
    imagens?: string[];
}
export declare class SaveMuseumResearchDto extends OptionalTextDto {
    descricao?: string | null;
    url?: string | null;
}
export declare class AddPublicationImageDto {
    imagemUrl: string;
}
export {};
