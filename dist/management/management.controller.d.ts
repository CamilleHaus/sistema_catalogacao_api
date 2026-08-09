import type { AuthenticatedUser } from '../auth/auth.types';
import { AnalysisDto, AnalysisImageDto, InstructionDto, InstructionImageDto, MovementDto, NamedDto, ReportDto, RestorationDto, ServiceDto } from './dto/management.dto';
import { ManagementService } from './management.service';
export declare class ManagementAuxController {
    private s;
    constructor(s: ManagementService);
    list(u: AuthenticatedUser): Promise<{
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
    estado(u: AuthenticatedUser, d: NamedDto): Promise<{
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
    tipo(u: AuthenticatedUser, d: NamedDto): Promise<{
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
    updateEstado(u: AuthenticatedUser, id: string, d: NamedDto): Promise<any>;
    updateTipo(u: AuthenticatedUser, id: string, d: NamedDto): Promise<any>;
}
export declare class ManagementController {
    private s;
    constructor(s: ManagementService);
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
    ca(p: string, w: string, d: AnalysisDto): Promise<{
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
    ua(p: string, w: string, i: string, d: AnalysisDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        obraId: string;
        observacoes: string | null;
        avaliador: string | null;
        estadoConservacaoId: string | null;
    }>;
    da(p: string, w: string, i: string): Promise<any>;
    ai(p: string, w: string, i: string, d: AnalysisImageDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        imagemUrl: string;
        creditos: string | null;
        comentarios: string | null;
        analiseId: string;
    }>;
    ui(p: string, w: string, i: string, x: string, d: AnalysisImageDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        imagemUrl: string;
        creditos: string | null;
        comentarios: string | null;
        analiseId: string;
    }>;
    di(p: string, w: string, i: string, x: string): Promise<any>;
    cr(p: string, w: string, d: RestorationDto): Promise<{
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
    ur(p: string, w: string, i: string, d: RestorationDto): Promise<{
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
    dr(p: string, w: string, i: string): Promise<any>;
    report(p: string, w: string, i: string, d: ReportDto): Promise<{
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
    delReport(p: string, w: string, i: string): Promise<{
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
    cs(p: string, w: string, d: ServiceDto): Promise<{
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
    us(p: string, w: string, i: string, d: ServiceDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        observacoes: string | null;
        local: string | null;
        tipoServicoId: string | null;
    }>;
    ds(p: string, w: string, i: string): Promise<any>;
    ci(p: string, w: string, d: InstructionDto): Promise<{
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
    uin(p: string, w: string, i: string, d: InstructionDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        observacoes: string | null;
        tipo: import("@prisma/client").$Enums.TipoInstrucaoObra | null;
        profissionalResponsavel: string | null;
    }>;
    din(p: string, w: string, i: string): Promise<any>;
    ii(p: string, w: string, i: string, d: InstructionImageDto): Promise<{
        id: string;
        criadoEm: Date;
        imagemUrl: string;
        instrucaoId: string;
    }>;
    dix(p: string, w: string, i: string, x: string): Promise<any>;
    cm(p: string, w: string, d: MovementDto): Promise<{
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
    um(p: string, w: string, i: string, d: MovementDto): Promise<{
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
    dm(p: string, w: string, i: string): Promise<any>;
}
