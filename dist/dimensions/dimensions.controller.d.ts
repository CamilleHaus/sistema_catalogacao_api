import { TipoDimensao } from '@prisma/client';
import { DimensionsService } from './dimensions.service';
import { UpsertDimensionDto } from './dto/upsert-dimension.dto';
export declare class DimensionsController {
    private readonly service;
    constructor(service: DimensionsService);
    upsert(projetoId: string, obraId: string, tipo: TipoDimensao, dto: UpsertDimensionDto): Promise<({
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        tipo: import("@prisma/client").$Enums.TipoDimensao;
        altura: import("@prisma/client/runtime/library").Decimal | null;
        largura: import("@prisma/client/runtime/library").Decimal | null;
        profundidade: import("@prisma/client/runtime/library").Decimal | null;
        unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
        descricaoVariavel: string | null;
    } & {
        formato: "VARIAVEL";
    }) | ({
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        obraId: string;
        tipo: import("@prisma/client").$Enums.TipoDimensao;
        altura: import("@prisma/client/runtime/library").Decimal | null;
        largura: import("@prisma/client/runtime/library").Decimal | null;
        profundidade: import("@prisma/client/runtime/library").Decimal | null;
        unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
        descricaoVariavel: string | null;
    } & {
        formato: "NUMERICA";
        altura: number;
        largura: number;
        profundidade: number | null;
        conversao: {
            altura: {
                valor: number;
                unidade: "CM" | "IN";
            };
            largura: {
                valor: number;
                unidade: "CM" | "IN";
            };
            profundidade: {
                valor: number;
                unidade: "CM" | "IN";
            } | null;
        };
    })>;
    remove(projetoId: string, obraId: string, tipo: TipoDimensao): Promise<{
        removida: boolean;
    }>;
}
