import { AddPublicationImageDto, SaveCurriculumDto, SaveMuseumResearchDto, SavePublicationDto } from './dto/research.dto';
import { ResearchService } from './research.service';
export declare class ResearchController {
    private readonly service;
    constructor(service: ResearchService);
    list(p: string, w: string): Promise<{
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
            autor: string | null;
            editora: string | null;
            ano: number | null;
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
    createCurriculum(p: string, w: string, dto: SaveCurriculumDto): Promise<{
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
    updateCurriculum(p: string, w: string, id: string, dto: SaveCurriculumDto): Promise<{
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
    removeCurriculum(p: string, w: string, id: string): Promise<{
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
    createPublication(p: string, w: string, dto: SavePublicationDto): Promise<{
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
        autor: string | null;
        editora: string | null;
        ano: number | null;
    }>;
    updatePublication(p: string, w: string, id: string, dto: SavePublicationDto): Promise<{
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
        autor: string | null;
        editora: string | null;
        ano: number | null;
    }>;
    removePublication(p: string, w: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        pagina: string | null;
        titulo: string | null;
        obraId: string;
        autor: string | null;
        editora: string | null;
        ano: number | null;
    }>;
    addImage(p: string, w: string, id: string, dto: AddPublicationImageDto): Promise<{
        id: string;
        criadoEm: Date;
        imagemUrl: string;
        publicacaoId: string;
    }>;
    removeImage(p: string, w: string, id: string, imageId: string): Promise<{
        id: string;
        criadoEm: Date;
        imagemUrl: string;
        publicacaoId: string;
    }>;
    createMuseum(p: string, w: string, dto: SaveMuseumResearchDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        url: string | null;
        descricao: string | null;
        titulo: string | null;
        obraId: string;
    }>;
    updateMuseum(p: string, w: string, id: string, dto: SaveMuseumResearchDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        url: string | null;
        descricao: string | null;
        titulo: string | null;
        obraId: string;
    }>;
    removeMuseum(p: string, w: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        url: string | null;
        descricao: string | null;
        titulo: string | null;
        obraId: string;
    }>;
}
