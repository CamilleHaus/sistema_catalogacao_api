import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { SaveDocumentDto, SaveEvaluationDto, SaveInsuranceDto, SaveTransactionDto } from './dto/financial.dto';
export declare class FinancialService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly acquisitionInclude;
    private readonly saleInclude;
    get(projectId: string, workId: string): Promise<{
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
                valor: Prisma.Decimal | null;
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
                valor: Prisma.Decimal | null;
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
            valor: Prisma.Decimal | null;
            tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
            desconto: Prisma.Decimal | null;
            adquiridoDe: string | null;
            valorFinal: Prisma.Decimal | null;
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
                valor: Prisma.Decimal | null;
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
            valor: Prisma.Decimal | null;
            tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
            desconto: Prisma.Decimal | null;
            valorFinal: Prisma.Decimal | null;
            vendidoPara: string | null;
        }) | null;
        avaliacoes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            data: Date | null;
            obraId: string;
            moeda: import("@prisma/client").$Enums.Moeda | null;
            valor: Prisma.Decimal | null;
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
            valor: Prisma.Decimal | null;
            vigencia: string | null;
            modalidadeSeguroId: string | null;
        })[];
    }>;
    saveTransaction(projectId: string, workId: string, kind: 'aquisicao' | 'venda', dto: SaveTransactionDto, create: boolean): Promise<({
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
            valor: Prisma.Decimal | null;
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
            valor: Prisma.Decimal | null;
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
        valor: Prisma.Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: Prisma.Decimal | null;
        adquiridoDe: string | null;
        valorFinal: Prisma.Decimal | null;
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
            valor: Prisma.Decimal | null;
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
        valor: Prisma.Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: Prisma.Decimal | null;
        valorFinal: Prisma.Decimal | null;
        vendidoPara: string | null;
    })>;
    removeTransaction(projectId: string, workId: string, kind: 'aquisicao' | 'venda'): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: Prisma.Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: Prisma.Decimal | null;
        adquiridoDe: string | null;
        valorFinal: Prisma.Decimal | null;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        obraId: string;
        formaNegociacaoId: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: Prisma.Decimal | null;
        tipoDesconto: import("@prisma/client").$Enums.TipoDesconto | null;
        desconto: Prisma.Decimal | null;
        valorFinal: Prisma.Decimal | null;
        vendidoPara: string | null;
    }>;
    saveDocument(projectId: string, workId: string, kind: 'nota' | 'pagamento' | 'venda', dto: SaveDocumentDto, id?: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: Prisma.Decimal | null;
        comentarios: string | null;
        aquisicaoId: string;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: Prisma.Decimal | null;
        comentarios: string | null;
        vendaId: string;
    }>;
    removeDocument(projectId: string, workId: string, kind: 'nota' | 'pagamento' | 'venda', id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: Prisma.Decimal | null;
        comentarios: string | null;
        aquisicaoId: string;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        imagemUrl: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: Prisma.Decimal | null;
        comentarios: string | null;
        vendaId: string;
    }>;
    saveEvaluation(projectId: string, workId: string, dto: SaveEvaluationDto, id?: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        obraId: string;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: Prisma.Decimal | null;
        comentarios: string | null;
        avaliador: string | null;
    }>;
    saveInsurance(projectId: string, workId: string, dto: SaveInsuranceDto, id?: string): Promise<{
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
        valor: Prisma.Decimal | null;
        vigencia: string | null;
        modalidadeSeguroId: string | null;
    }>;
    removeChild(projectId: string, workId: string, kind: 'avaliacao' | 'seguro', id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: Date | null;
        obraId: string;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: Prisma.Decimal | null;
        comentarios: string | null;
        avaliador: string | null;
    } | {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        observacoes: string | null;
        moeda: import("@prisma/client").$Enums.Moeda | null;
        valor: Prisma.Decimal | null;
        vigencia: string | null;
        modalidadeSeguroId: string | null;
    }>;
    private context;
    private validReference;
    private requireDocument;
    private requireChild;
    private patch;
    private patchText;
    private date;
}
