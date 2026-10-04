import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import type { CreateWorkAttachmentDto, CreateWorkImageDto, UpdateWorkAttachmentDto, UpdateWorkImageDto } from './dto/work-media.dto';
export declare class WorkMediaService {
    private readonly prisma;
    private readonly storage;
    constructor(prisma: PrismaService, storage: StorageService);
    gallery(projetoId: string, obraId: string): Promise<{
        imagens: {
            principal: boolean;
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            imagemUrl: string;
            obraId: string;
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
            localAssinaturaId: string;
            catalogacaoId: string;
        })[];
    }>;
    createImage(projetoId: string, obraId: string, dto: CreateWorkImageDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        imagemUrl: string;
        obraId: string;
        creditos: string | null;
        observacoes: string | null;
    }>;
    updateImage(projetoId: string, obraId: string, id: string, dto: UpdateWorkImageDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        imagemUrl: string;
        obraId: string;
        creditos: string | null;
        observacoes: string | null;
    }>;
    setMain(projetoId: string, obraId: string, id: string): Promise<{
        imagemId: string;
        principal: boolean;
    }>;
    removeImage(projetoId: string, obraId: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        imagemUrl: string;
        obraId: string;
        creditos: string | null;
        observacoes: string | null;
    }>;
    listAttachments(projetoId: string, obraId: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        tipo: import("@prisma/client").$Enums.TipoArquivoAnexo;
        arquivoUrl: string;
        extensao: string | null;
    }[]>;
    createAttachment(projetoId: string, obraId: string, dto: CreateWorkAttachmentDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        tipo: import("@prisma/client").$Enums.TipoArquivoAnexo;
        arquivoUrl: string;
        extensao: string | null;
    }>;
    updateAttachment(projetoId: string, obraId: string, id: string, dto: UpdateWorkAttachmentDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        tipo: import("@prisma/client").$Enums.TipoArquivoAnexo;
        arquivoUrl: string;
        extensao: string | null;
    }>;
    removeAttachment(projetoId: string, obraId: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        tipo: import("@prisma/client").$Enums.TipoArquivoAnexo;
        arquivoUrl: string;
        extensao: string | null;
    }>;
    private imageData;
    private attachmentData;
    private requireWork;
    private requireImage;
    private requireAttachment;
    private text;
}
