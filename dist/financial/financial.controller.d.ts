import { SaveDocumentDto, SaveEvaluationDto, SaveInsuranceDto, SaveTransactionDto } from './dto/financial.dto';
import { FinancialService } from './financial.service';
export declare class FinancialController {
    private readonly service;
    constructor(service: FinancialService);
    get(p: string, w: string): Promise<{
        aquisicao: ({
            formaNegociacao: {
                id: string;
                empresaId: string;
                nome: string;
                criadoEm: Date;
                atualizadoEm: Date;
            } | null;
            notasFiscais: {
                id: string;
                criadoEm: Date;
                atualizadoEm: Date;
                data: Date | null;
                imagemUrl: string | null;
                moeda: import("@prisma/client").$Enums.Moeda | null;
                valor: import("@prisma/client/runtime/library").Decimal | null;
                numero: string | null;
                comentarios: string | null;
                aquisicaoId: string;
            }[];
            comprovantes: {
                id: string;
                criadoEm: Date;
                atualizadoEm: Date;
                data: Date | null;
                imagemUrl: string | null;
                moeda: import("@prisma/client").$Enums.Moeda | null;
                valor: import("@prisma/client/runtime/library").Decimal | null;
                comentarios: string | null;
                aquisicaoId: string;
            }[];
        } & {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: string | null;
            obraId: string;
            formaNegociacaoId: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
            desconto: import("@prisma/client/runtime/library").Decimal | null;
            adquiridoDe: string | null;
            valorFinal: import("@prisma/client/runtime/library").Decimal | null;
        }) | null;
        venda: ({
            formaNegociacao: {
                id: string;
                empresaId: string;
                nome: string;
                criadoEm: Date;
                atualizadoEm: Date;
            } | null;
            comprovantes: {
                id: string;
                criadoEm: Date;
                atualizadoEm: Date;
                data: Date | null;
                imagemUrl: string | null;
                moeda: import("@prisma/client").$Enums.Moeda | null;
                valor: import("@prisma/client/runtime/library").Decimal | null;
                comentarios: string | null;
                vendaId: string;
            }[];
        } & {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: string | null;
            obraId: string;
            formaNegociacaoId: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
            desconto: import("@prisma/client/runtime/library").Decimal | null;
            valorFinal: import("@prisma/client/runtime/library").Decimal | null;
            vendidoPara: string | null;
        }) | null;
        avaliacoes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            obraId: string;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            comentarios: string | null;
            avaliador: string | null;
        }[];
        seguros: ({
            modalidadeSeguro: {
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
            obraId: string;
            observacoes: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            vigencia: string | null;
            modalidadeSeguroId: string | null;
        })[];
    }>;
    createAcquisition(p: string, w: string, dto: SaveTransactionDto): Promise<({
        formaNegociacao: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
        notasFiscais: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            imagemUrl: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            numero: string | null;
            comentarios: string | null;
            aquisicaoId: string;
        }[];
        comprovantes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            imagemUrl: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            comentarios: string | null;
            aquisicaoId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: import("@prisma/client/runtime/library").Decimal | null;
        adquiridoDe: string | null;
        valorFinal: import("@prisma/client/runtime/library").Decimal | null;
    }) | ({
        formaNegociacao: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
        comprovantes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            imagemUrl: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            comentarios: string | null;
            vendaId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: import("@prisma/client/runtime/library").Decimal | null;
        valorFinal: import("@prisma/client/runtime/library").Decimal | null;
        vendidoPara: string | null;
    })>;
    updateAcquisition(p: string, w: string, dto: SaveTransactionDto): Promise<({
        formaNegociacao: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
        notasFiscais: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            imagemUrl: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            numero: string | null;
            comentarios: string | null;
            aquisicaoId: string;
        }[];
        comprovantes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            imagemUrl: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            comentarios: string | null;
            aquisicaoId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: import("@prisma/client/runtime/library").Decimal | null;
        adquiridoDe: string | null;
        valorFinal: import("@prisma/client/runtime/library").Decimal | null;
    }) | ({
        formaNegociacao: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
        comprovantes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            imagemUrl: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            comentarios: string | null;
            vendaId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: import("@prisma/client/runtime/library").Decimal | null;
        valorFinal: import("@prisma/client/runtime/library").Decimal | null;
        vendidoPara: string | null;
    })>;
    removeAcquisition(p: string, w: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: import("@prisma/client/runtime/library").Decimal | null;
        adquiridoDe: string | null;
        valorFinal: import("@prisma/client/runtime/library").Decimal | null;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: import("@prisma/client/runtime/library").Decimal | null;
        valorFinal: import("@prisma/client/runtime/library").Decimal | null;
        vendidoPara: string | null;
    }>;
    createSale(p: string, w: string, dto: SaveTransactionDto): Promise<({
        formaNegociacao: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
        notasFiscais: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            imagemUrl: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            numero: string | null;
            comentarios: string | null;
            aquisicaoId: string;
        }[];
        comprovantes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            imagemUrl: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            comentarios: string | null;
            aquisicaoId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: import("@prisma/client/runtime/library").Decimal | null;
        adquiridoDe: string | null;
        valorFinal: import("@prisma/client/runtime/library").Decimal | null;
    }) | ({
        formaNegociacao: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
        comprovantes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            imagemUrl: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            comentarios: string | null;
            vendaId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: import("@prisma/client/runtime/library").Decimal | null;
        valorFinal: import("@prisma/client/runtime/library").Decimal | null;
        vendidoPara: string | null;
    })>;
    updateSale(p: string, w: string, dto: SaveTransactionDto): Promise<({
        formaNegociacao: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
        notasFiscais: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            imagemUrl: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            numero: string | null;
            comentarios: string | null;
            aquisicaoId: string;
        }[];
        comprovantes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            imagemUrl: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            comentarios: string | null;
            aquisicaoId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: import("@prisma/client/runtime/library").Decimal | null;
        adquiridoDe: string | null;
        valorFinal: import("@prisma/client/runtime/library").Decimal | null;
    }) | ({
        formaNegociacao: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        } | null;
        comprovantes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            imagemUrl: string | null;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: import("@prisma/client/runtime/library").Decimal | null;
            comentarios: string | null;
            vendaId: string;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: import("@prisma/client/runtime/library").Decimal | null;
        valorFinal: import("@prisma/client/runtime/library").Decimal | null;
        vendidoPara: string | null;
    })>;
    removeSale(p: string, w: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: import("@prisma/client/runtime/library").Decimal | null;
        adquiridoDe: string | null;
        valorFinal: import("@prisma/client/runtime/library").Decimal | null;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: import("@prisma/client/runtime/library").Decimal | null;
        valorFinal: import("@prisma/client/runtime/library").Decimal | null;
        vendidoPara: string | null;
    }>;
    createInvoice(p: string, w: string, dto: SaveDocumentDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        aquisicaoId: string;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        vendaId: string;
    }>;
    updateInvoice(p: string, w: string, id: string, dto: SaveDocumentDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        aquisicaoId: string;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        vendaId: string;
    }>;
    removeInvoice(p: string, w: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        aquisicaoId: string;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        vendaId: string;
    }>;
    createPayment(p: string, w: string, dto: SaveDocumentDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        aquisicaoId: string;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        vendaId: string;
    }>;
    updatePayment(p: string, w: string, id: string, dto: SaveDocumentDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        aquisicaoId: string;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        vendaId: string;
    }>;
    removePayment(p: string, w: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        aquisicaoId: string;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        vendaId: string;
    }>;
    createSaleReceipt(p: string, w: string, dto: SaveDocumentDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        aquisicaoId: string;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        vendaId: string;
    }>;
    updateSaleReceipt(p: string, w: string, id: string, dto: SaveDocumentDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        aquisicaoId: string;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        vendaId: string;
    }>;
    removeSaleReceipt(p: string, w: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        aquisicaoId: string;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        vendaId: string;
    }>;
    createEvaluation(p: string, w: string, dto: SaveEvaluationDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        obraId: string;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        avaliador: string | null;
    }>;
    updateEvaluation(p: string, w: string, id: string, dto: SaveEvaluationDto): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        obraId: string;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        avaliador: string | null;
    }>;
    removeEvaluation(p: string, w: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        obraId: string;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        avaliador: string | null;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        vigencia: string | null;
        modalidadeSeguroId: string | null;
    }>;
    createInsurance(p: string, w: string, dto: SaveInsuranceDto): Promise<{
        modalidadeSeguro: {
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
        obraId: string;
        observacoes: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        vigencia: string | null;
        modalidadeSeguroId: string | null;
    }>;
    updateInsurance(p: string, w: string, id: string, dto: SaveInsuranceDto): Promise<{
        modalidadeSeguro: {
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
        obraId: string;
        observacoes: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        vigencia: string | null;
        modalidadeSeguroId: string | null;
    }>;
    removeInsurance(p: string, w: string, id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        obraId: string;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        comentarios: string | null;
        avaliador: string | null;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: import("@prisma/client/runtime/library").Decimal | null;
        vigencia: string | null;
        modalidadeSeguroId: string | null;
    }>;
}
