import type { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';
import type { AnalysisDto, AnalysisImageDto, InstructionDto, MovementDto, RestorationDto, ServiceDto } from './dto/management.dto';
export declare class ManagementService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    auxiliaries(user: AuthenticatedUser): Promise<{
        estadosConservacao: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        }[];
        tiposServico: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        }[];
    }>;
    createAux(user: AuthenticatedUser, kind: 'estado' | 'tipo', nome: string): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    } | {
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    updateAux(user: AuthenticatedUser, kind: 'estado' | 'tipo', id: string, nome: string): Promise<any>;
    get(p: string, w: string): Promise<{
        analises: ({
            estadoConservacao: {
                id: string;
                empresaId: string;
                nome: string;
                criadoEm: Date;
                atualizadoEm: Date;
            } | null;
            imagens: {
                id: string;
                criadoEm: Date;
                atualizadoEm: Date;
                imagemUrl: string;
                creditos: string | null;
                comentarios: string | null;
                analiseId: string;
            }[];
        } & {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            obraId: string;
            observacoes: string | null;
            avaliador: string | null;
            estadoConservacaoId: string | null;
        })[];
        restauros: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            obraId: string;
            observacoes: string | null;
            dataEntrada: string | null;
            dataSaida: string | null;
            localRestauro: string | null;
            motivo: string | null;
            relatorioUrl: string | null;
            relatorioExtensao: string | null;
        }[];
        servicos: ({
            tipoServico: {
                id: string;
                empresaId: string;
                nome: string;
                criadoEm: Date;
                atualizadoEm: Date;
            } | null;
        } & {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: string | null;
            obraId: string;
            observacoes: string | null;
            local: string | null;
            tipoServicoId: string | null;
        })[];
        instrucoes: ({
            imagens: {
                id: string;
                criadoEm: Date;
                imagemUrl: string;
                instrucaoId: string;
            }[];
        } & {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: string | null;
            obraId: string;
            observacoes: string | null;
            tipo: import("@prisma/client").$Enums.TipoInstrucaoObra | null;
            profissionalResponsavel: string | null;
        })[];
        movimentacoes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: string | null;
            obraId: string;
            observacoes: string | null;
            realizadoPor: string | null;
            localSaidaId: string | null;
            localSaidaSnapshot: string | null;
            localEntradaId: string | null;
            localEntradaSnapshot: string | null;
        }[];
    }>;
    createAnalysis(p: string, w: string, d: AnalysisDto): Promise<{
        estadoConservacao: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
        imagens: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            imagemUrl: string;
            creditos: string | null;
            comentarios: string | null;
            analiseId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        obraId: string;
        observacoes: string | null;
        avaliador: string | null;
        estadoConservacaoId: string | null;
    }>;
    updateAnalysis(p: string, w: string, id: string, d: AnalysisDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        obraId: string;
        observacoes: string | null;
        avaliador: string | null;
        estadoConservacaoId: string | null;
    }>;
    addAnalysisImage(p: string, w: string, id: string, d: AnalysisImageDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        imagemUrl: string;
        creditos: string | null;
        comentarios: string | null;
        analiseId: string;
    }>;
    updateAnalysisImage(p: string, w: string, id: string, imageId: string, d: AnalysisImageDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        imagemUrl: string;
        creditos: string | null;
        comentarios: string | null;
        analiseId: string;
    }>;
    createRestoration(p: string, w: string, d: RestorationDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        dataEntrada: string | null;
        dataSaida: string | null;
        localRestauro: string | null;
        motivo: string | null;
        relatorioUrl: string | null;
        relatorioExtensao: string | null;
    }>;
    updateRestoration(p: string, w: string, id: string, d: RestorationDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        dataEntrada: string | null;
        dataSaida: string | null;
        localRestauro: string | null;
        motivo: string | null;
        relatorioUrl: string | null;
        relatorioExtensao: string | null;
    }>;
    report(p: string, w: string, id: string, url: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        dataEntrada: string | null;
        dataSaida: string | null;
        localRestauro: string | null;
        motivo: string | null;
        relatorioUrl: string | null;
        relatorioExtensao: string | null;
    }>;
    createService(p: string, w: string, d: ServiceDto): Promise<{
        tipoServico: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        observacoes: string | null;
        local: string | null;
        tipoServicoId: string | null;
    }>;
    updateService(p: string, w: string, id: string, d: ServiceDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        observacoes: string | null;
        local: string | null;
        tipoServicoId: string | null;
    }>;
    createInstruction(p: string, w: string, d: InstructionDto): Promise<{
        imagens: {
            id: string;
            criadoEm: Date;
            imagemUrl: string;
            instrucaoId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        observacoes: string | null;
        tipo: import("@prisma/client").$Enums.TipoInstrucaoObra | null;
        profissionalResponsavel: string | null;
    }>;
    updateInstruction(p: string, w: string, id: string, d: InstructionDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        observacoes: string | null;
        tipo: import("@prisma/client").$Enums.TipoInstrucaoObra | null;
        profissionalResponsavel: string | null;
    }>;
    addInstructionImage(p: string, w: string, id: string, url: string): Promise<{
        id: string;
        criadoEm: Date;
        imagemUrl: string;
        instrucaoId: string;
    }>;
    createMovement(p: string, w: string, d: MovementDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        observacoes: string | null;
        realizadoPor: string | null;
        localSaidaId: string | null;
        localSaidaSnapshot: string | null;
        localEntradaId: string | null;
        localEntradaSnapshot: string | null;
    }>;
    updateMovement(p: string, w: string, id: string, d: MovementDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        observacoes: string | null;
        realizadoPor: string | null;
        localSaidaId: string | null;
        localSaidaSnapshot: string | null;
        localEntradaId: string | null;
        localEntradaSnapshot: string | null;
    }>;
    remove(p: string, w: string, kind: string, id: string): Promise<any>;
    removeImage(p: string, w: string, kind: 'analise' | 'instrucao', parent: string, id: string): Promise<any>;
    removeReport(p: string, w: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        dataEntrada: string | null;
        dataSaida: string | null;
        localRestauro: string | null;
        motivo: string | null;
        relatorioUrl: string | null;
        relatorioExtensao: string | null;
    }>;
    private work;
    private child;
    private aux;
    private path;
    private analysis;
    private restoration;
    private serviceData;
    private instruction;
    private movement;
    private extension;
    private text;
    private company;
}
