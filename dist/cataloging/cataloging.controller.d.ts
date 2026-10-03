import { CatalogingService } from './cataloging.service';
import { CreateCertificateDto, CreateSignatureDto, SaveCatalogingDto } from './dto/cataloging.dto';
export declare class CatalogingController {
    private readonly service;
    constructor(service: CatalogingService);
    get(project: string, work: string): Promise<(Omit<{
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
            imagemUrl: string | null;
            catalogacaoId: string;
            localAssinaturaId: string;
        })[];
        certificados: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            imagemUrl: string;
            observacoes: string | null;
            catalogacaoId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        categoriaId: string | null;
        proveniencia: string | null;
    }, "tags"> & {
        tags: unknown[];
    }) | null>;
    save(project: string, work: string, dto: SaveCatalogingDto): Promise<Omit<{
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
            imagemUrl: string | null;
            catalogacaoId: string;
            localAssinaturaId: string;
        })[];
        certificados: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            imagemUrl: string;
            observacoes: string | null;
            catalogacaoId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        categoriaId: string | null;
        proveniencia: string | null;
    }, "tags"> & {
        tags: unknown[];
    }>;
    addSignature(p: string, w: string, dto: CreateSignatureDto): Promise<{
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
        imagemUrl: string | null;
        catalogacaoId: string;
        localAssinaturaId: string;
    }>;
    updateSignature(p: string, w: string, id: string, dto: CreateSignatureDto): Promise<{
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
        imagemUrl: string | null;
        catalogacaoId: string;
        localAssinaturaId: string;
    }>;
    removeSignature(p: string, w: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        imagemUrl: string | null;
        catalogacaoId: string;
        localAssinaturaId: string;
    }>;
    addCertificate(p: string, w: string, dto: CreateCertificateDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        imagemUrl: string;
        observacoes: string | null;
        catalogacaoId: string;
    }>;
    updateCertificate(p: string, w: string, id: string, dto: CreateCertificateDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        imagemUrl: string;
        observacoes: string | null;
        catalogacaoId: string;
    }>;
    removeCertificate(p: string, w: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        imagemUrl: string;
        observacoes: string | null;
        catalogacaoId: string;
    }>;
}
