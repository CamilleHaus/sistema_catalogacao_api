import { TipoInstrucaoObra } from '@prisma/client';
export declare class NamedDto {
    nome: string;
}
export declare class AnalysisDto {
    data?: string | null;
    estadoConservacaoId?: string | null;
    avaliador?: string | null;
    observacoes?: string | null;
}
export declare class AnalysisImageDto {
    imagemUrl: string;
    creditos?: string | null;
    comentarios?: string | null;
}
export declare class RestorationDto {
    dataEntrada?: string | null;
    dataSaida?: string | null;
    localRestauro?: string | null;
    motivo?: string | null;
    observacoes?: string | null;
}
export declare class ReportDto {
    url: string;
}
export declare class ServiceDto {
    data?: string | null;
    tipoServicoId?: string | null;
    local?: string | null;
    observacoes?: string | null;
}
export declare class InstructionDto {
    tipo?: TipoInstrucaoObra | null;
    data?: string | null;
    profissionalResponsavel?: string | null;
    observacoes?: string | null;
}
export declare class InstructionImageDto {
    imagemUrl: string;
}
export declare class MovementDto {
    data?: string | null;
    realizadoPor?: string | null;
    observacoes?: string | null;
    localSaidaId?: string | null;
    localEntradaId?: string | null;
}
