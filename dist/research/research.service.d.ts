import { PrismaService } from '../database/prisma.service';
import type { AddPublicationImageDto, SaveCurriculumDto, SaveMuseumResearchDto, SavePublicationDto } from './dto/research.dto';
export declare class ResearchService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(projetoId: string, obraId: string): Promise<{
        curriculos: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: string | null;
            obraId: string;
            nomeExposicao: string | null;
            instituicao: string | null;
            cidade: string | null;
            pais: string | null;
        }[];
        publicacoes: ({
            imagens: {
                id: string;
                criadoEm: Date;
                imagemUrl: string;
                publicacaoId: string;
            }[];
        } & {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            pagina: string | null;
            titulo: string | null;
            obraId: string;
            ano: number | null;
            autor: string | null;
            editora: string | null;
        })[];
        pesquisasMuseologicas: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            url: string | null;
            descricao: string | null;
            titulo: string | null;
            obraId: string;
        }[];
    }>;
    createCurriculum(projetoId: string, obraId: string, dto: SaveCurriculumDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        nomeExposicao: string | null;
        instituicao: string | null;
        cidade: string | null;
        pais: string | null;
    }>;
    updateCurriculum(projetoId: string, obraId: string, id: string, dto: SaveCurriculumDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        nomeExposicao: string | null;
        instituicao: string | null;
        cidade: string | null;
        pais: string | null;
    }>;
    removeCurriculum(projetoId: string, obraId: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        nomeExposicao: string | null;
        instituicao: string | null;
        cidade: string | null;
        pais: string | null;
    }>;
    createPublication(projetoId: string, obraId: string, dto: SavePublicationDto): Promise<{
        imagens: {
            id: string;
            criadoEm: Date;
            imagemUrl: string;
            publicacaoId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        pagina: string | null;
        titulo: string | null;
        obraId: string;
        ano: number | null;
        autor: string | null;
        editora: string | null;
    }>;
    updatePublication(projetoId: string, obraId: string, id: string, dto: SavePublicationDto): Promise<{
        imagens: {
            id: string;
            criadoEm: Date;
            imagemUrl: string;
            publicacaoId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        pagina: string | null;
        titulo: string | null;
        obraId: string;
        ano: number | null;
        autor: string | null;
        editora: string | null;
    }>;
    removePublication(projetoId: string, obraId: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        pagina: string | null;
        titulo: string | null;
        obraId: string;
        ano: number | null;
        autor: string | null;
        editora: string | null;
    }>;
    addPublicationImage(projetoId: string, obraId: string, publicationId: string, dto: AddPublicationImageDto): Promise<{
        id: string;
        criadoEm: Date;
        imagemUrl: string;
        publicacaoId: string;
    }>;
    removePublicationImage(projetoId: string, obraId: string, publicationId: string, imageId: string): Promise<{
        id: string;
        criadoEm: Date;
        imagemUrl: string;
        publicacaoId: string;
    }>;
    createMuseumResearch(projetoId: string, obraId: string, dto: SaveMuseumResearchDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        url: string | null;
        descricao: string | null;
        titulo: string | null;
        obraId: string;
    }>;
    updateMuseumResearch(projetoId: string, obraId: string, id: string, dto: SaveMuseumResearchDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        url: string | null;
        descricao: string | null;
        titulo: string | null;
        obraId: string;
    }>;
    removeMuseumResearch(projetoId: string, obraId: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        url: string | null;
        descricao: string | null;
        titulo: string | null;
        obraId: string;
    }>;
    private requireWork;
    private requireChild;
    private curriculumData;
    private publicationData;
    private museumData;
    private optionalData;
    private text;
    private validateMuseumContent;
}
