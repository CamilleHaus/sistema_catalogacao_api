import { CreateWorkAttachmentDto, CreateWorkImageDto, UpdateWorkAttachmentDto, UpdateWorkImageDto } from './dto/work-media.dto';
import { WorkMediaService } from './work-media.service';
export declare class WorkMediaController {
    private readonly service;
    constructor(service: WorkMediaService);
    gallery(p: string, w: string): Promise<{
        imagens: {
            principal: boolean;
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            obraId: string;
            imagemUrl: string;
            creditos: string | null;
            observacoes: string | null;
        }[];
        assinaturas: ({
            localAssinatura: {
                id: string;
                nome: string;
            };
        } & {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            imagemUrl: string | null;
            catalogacaoId: string;
            localAssinaturaId: string;
        })[];
    }>;
    createImage(p: string, w: string, dto: CreateWorkImageDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        imagemUrl: string;
        creditos: string | null;
        observacoes: string | null;
    }>;
    updateImage(p: string, w: string, id: string, dto: UpdateWorkImageDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        imagemUrl: string;
        creditos: string | null;
        observacoes: string | null;
    }>;
    setMain(p: string, w: string, id: string): Promise<{
        imagemId: string;
        principal: boolean;
    }>;
    removeImage(p: string, w: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        imagemUrl: string;
        creditos: string | null;
        observacoes: string | null;
    }>;
    attachments(p: string, w: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        tipo: import("@prisma/client").$Enums.TipoArquivoAnexo;
        arquivoUrl: string;
        extensao: string | null;
    }[]>;
    createAttachment(p: string, w: string, dto: CreateWorkAttachmentDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        tipo: import("@prisma/client").$Enums.TipoArquivoAnexo;
        arquivoUrl: string;
        extensao: string | null;
    }>;
    updateAttachment(p: string, w: string, id: string, dto: UpdateWorkAttachmentDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        tipo: import("@prisma/client").$Enums.TipoArquivoAnexo;
        arquivoUrl: string;
        extensao: string | null;
    }>;
    removeAttachment(p: string, w: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        tipo: import("@prisma/client").$Enums.TipoArquivoAnexo;
        arquivoUrl: string;
        extensao: string | null;
    }>;
}
