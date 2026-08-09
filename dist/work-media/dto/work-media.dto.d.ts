import { TipoArquivoAnexo } from '@prisma/client';
export declare class CreateWorkImageDto {
    imagemUrl: string;
    creditos?: string | null;
    observacoes?: string | null;
}
export declare class UpdateWorkImageDto {
    imagemUrl?: string;
    creditos?: string | null;
    observacoes?: string | null;
}
export declare class CreateWorkAttachmentDto {
    arquivoUrl: string;
    tipo: TipoArquivoAnexo;
    observacoes?: string | null;
}
export declare class UpdateWorkAttachmentDto extends CreateWorkAttachmentDto {
}
