import { PrismaService } from '../database/prisma.service';
import type { CreateCertificateDto, CreateSignatureDto, SaveCatalogingDto } from './dto/cataloging.dto';
export declare class CatalogingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly include;
    get(projetoId: string, obraId: string): Promise<(Omit<{
        tags: ({
            tag: {
                id: string;
                empresaId: string;
                nome: string;
                criadoEm: Date;
                atualizadoEm: Date;
                cor: string | null;
            };
        } & {
            criadoEm: Date;
            catalogacaoId: string;
            tagId: string;
        })[];
        categoria: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
        assinaturas: ({
            localAssinatura: {
                id: string;
                empresaId: string;
                nome: string;
                criadoEm: Date;
                atualizadoEm: Date;
            };
        } & {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            localAssinaturaId: string;
            imagemUrl: string | null;
            catalogacaoId: string;
        })[];
        certificados: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            observacoes: string | null;
            imagemUrl: string;
            catalogacaoId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        categoriaId: string | null;
        proveniencia: string | null;
        observacoes: string | null;
    }, "tags"> & {
        tags: unknown[];
    }) | null>;
    save(projetoId: string, obraId: string, dto: SaveCatalogingDto): Promise<Omit<{
        tags: ({
            tag: {
                id: string;
                empresaId: string;
                nome: string;
                criadoEm: Date;
                atualizadoEm: Date;
                cor: string | null;
            };
        } & {
            criadoEm: Date;
            catalogacaoId: string;
            tagId: string;
        })[];
        categoria: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
        assinaturas: ({
            localAssinatura: {
                id: string;
                empresaId: string;
                nome: string;
                criadoEm: Date;
                atualizadoEm: Date;
            };
        } & {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            localAssinaturaId: string;
            imagemUrl: string | null;
            catalogacaoId: string;
        })[];
        certificados: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            observacoes: string | null;
            imagemUrl: string;
            catalogacaoId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        categoriaId: string | null;
        proveniencia: string | null;
        observacoes: string | null;
    }, "tags"> & {
        tags: unknown[];
    }>;
    addSignature(projetoId: string, obraId: string, dto: CreateSignatureDto): Promise<{
        localAssinatura: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        };
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        localAssinaturaId: string;
        imagemUrl: string | null;
        catalogacaoId: string;
    }>;
    updateSignature(projetoId: string, obraId: string, id: string, dto: CreateSignatureDto): Promise<{
        localAssinatura: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        };
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        localAssinaturaId: string;
        imagemUrl: string | null;
        catalogacaoId: string;
    }>;
    removeSignature(projetoId: string, obraId: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        localAssinaturaId: string;
        imagemUrl: string | null;
        catalogacaoId: string;
    }>;
    addCertificate(projetoId: string, obraId: string, dto: CreateCertificateDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        observacoes: string | null;
        imagemUrl: string;
        catalogacaoId: string;
    }>;
    updateCertificate(projetoId: string, obraId: string, id: string, dto: CreateCertificateDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        observacoes: string | null;
        imagemUrl: string;
        catalogacaoId: string;
    }>;
    removeCertificate(projetoId: string, obraId: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        observacoes: string | null;
        imagemUrl: string;
        catalogacaoId: string;
    }>;
    private context;
    private requireCatalog;
    private validateReferences;
    private validLocation;
    private requireChild;
    private text;
    private present;
}
