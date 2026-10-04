import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { WorksService } from '../works/works.service';
import type { AdvancedSearchDto, SaveSearchFilterDto } from './advanced-search.dto';
import { type OptionSource } from './search-fields';
type Option = {
    value: string;
    label: string;
};
export declare class AdvancedSearchService {
    private readonly prisma;
    private readonly works;
    constructor(prisma: PrismaService, works: WorksService);
    fields(projetoId: string): Promise<{
        opcoes?: {
            value: string;
            label: string;
        }[] | undefined;
        id: string;
        label: string;
        grupo: string;
        tipo: import("./search-fields").FieldType;
        operadores: string[];
    }[]>;
    search(projetoId: string, dto: AdvancedSearchDto): Promise<(Omit<{
        localizacao: {
            id: string;
            nome: string;
            paiId: string | null;
        } | null;
        tecnica: {
            id: string;
            nome: string;
            projetoId: string | null;
        } | null;
        fichaMae: {
            id: string;
            descricao: string;
            codigo: string;
        } | null;
        status: {
            id: string;
            nome: string;
        } | null;
        artistas: {
            artista: {
                id: string;
                empresaId: string;
                nome: string;
                criadoEm: Date;
                atualizadoEm: Date;
                localNascimento: string | null;
                anoNascimento: number | null;
                localFalecimento: string | null;
                anoFalecimento: number | null;
            };
        }[];
        imagemPrincipal: {
            id: string;
            imagemUrl: string;
            creditos: string | null;
        } | null;
        dimensoes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            altura: Prisma.Decimal | null;
            largura: Prisma.Decimal | null;
            profundidade: Prisma.Decimal | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
            descricaoVariavel: string | null;
            obraId: string;
            tipo: import("@prisma/client").$Enums.TipoDimensao;
        }[];
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        data: string | null;
        projetoId: string;
        statusId: string | null;
        tecnicaId: string | null;
        localizacaoId: string | null;
        numeroManual: string;
        titulo: string | null;
        edicao: string | null;
        quantidadePartes: number | null;
        tituloSerie: string | null;
        fichaMaeId: string | null;
        codigoAcervo: string;
        grupoObra: boolean;
        serie: boolean;
        fotoPrincipalUrl: string | null;
        imagemPrincipalId: string | null;
    }, "artistas" | "dimensoes"> & {
        fotoPrincipalUrl: string | null;
        fotoPrincipalCreditos: string | null;
        tituloExibicao: string;
        artistas: unknown[];
        dimensoes: (({
            altura: {
                toNumber(): number;
            } | null;
            largura: {
                toNumber(): number;
            } | null;
            profundidade: {
                toNumber(): number;
            } | null;
            unidade: import("@prisma/client").UnidadeMedida | null;
            descricaoVariavel: string | null;
        } & {
            formato: "VARIAVEL";
        }) | ({
            altura: {
                toNumber(): number;
            } | null;
            largura: {
                toNumber(): number;
            } | null;
            profundidade: {
                toNumber(): number;
            } | null;
            unidade: import("@prisma/client").UnidadeMedida | null;
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
        }))[];
    })[]>;
    listFilters(projetoId: string, usuarioId: string): Prisma.PrismaPromise<{
        id: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        usuarioId: string;
        projetoId: string;
        combinar: import("@prisma/client").$Enums.CombinacaoFiltro;
        condicoes: Prisma.JsonValue;
    }[]>;
    createFilter(projetoId: string, usuarioId: string, dto: SaveSearchFilterDto): Promise<{
        id: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        usuarioId: string;
        projetoId: string;
        combinar: import("@prisma/client").$Enums.CombinacaoFiltro;
        condicoes: Prisma.JsonValue;
    }>;
    updateFilter(projetoId: string, usuarioId: string, filtroId: string, dto: SaveSearchFilterDto): Promise<{
        id: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        usuarioId: string;
        projetoId: string;
        combinar: import("@prisma/client").$Enums.CombinacaoFiltro;
        condicoes: Prisma.JsonValue;
    }>;
    removeFilter(projetoId: string, usuarioId: string, filtroId: string): Promise<void>;
    private resolve;
    private validate;
    private scalar;
    private compare;
    private locationExpander;
    optionSources(projetoId: string): Promise<Record<OptionSource, Option[]>>;
    private locationOptions;
    private filterData;
    private requireFilter;
    private saving;
}
export {};
