import { Moeda, TipoDesconto } from '@prisma/client';
export declare class SaveTransactionDto {
    formaNegociacaoId?: string | null;
    data?: string | null;
    contraparte?: string | null;
    moeda?: Moeda | null;
    valor?: string | null;
    tipoDesconto?: TipoDesconto | null;
    desconto?: string | null;
    tipoComissao?: TipoDesconto | null;
    comissao?: string | null;
}
export declare class SaveDocumentDto {
    imagemUrl?: string | null;
    numero?: string | null;
    data?: string | null;
    moeda?: Moeda | null;
    valor?: string | null;
    comentarios?: string | null;
}
export declare class SaveEvaluationDto {
    data?: string | null;
    moeda?: Moeda | null;
    valor?: string | null;
    avaliador?: string | null;
    comentarios?: string | null;
}
export declare class SaveInsuranceDto {
    vigencia?: string | null;
    moeda?: Moeda | null;
    valor?: string | null;
    modalidadeSeguroId?: string | null;
    observacoes?: string | null;
}
