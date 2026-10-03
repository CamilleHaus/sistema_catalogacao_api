import { CreateWorkDto } from './dto/create-work.dto';
import { ListWorksQueryDto } from './dto/list-works-query.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { WorksService } from './works.service';
export declare class WorksController {
    private readonly service;
    constructor(service: WorksService);
    list(projetoId: string, query: ListWorksQueryDto): Promise<(Omit<{
        fichaMae: {
            id: string;
            codigo: string;
            descricao: string;
        } | null;
        imagemPrincipal: {
            id: string;
            imagemUrl: string;
            creditos: string | null;
        } | null;
        status: {
            id: string;
            nome: string;
        } | null;
        tecnica: {
            id: string;
            projetoId: string | null;
            nome: string;
        } | null;
        localizacao: {
            id: string;
            nome: string;
            paiId: string | null;
        } | null;
        artistas: {
            artista: {
                id: string;
                criadoEm: Date;
                atualizadoEm: Date;
                empresaId: string;
                nome: string;
                localNascimento: string | null;
                anoNascimento: number | null;
                localFalecimento: string | null;
                anoFalecimento: number | null;
            };
        }[];
        dimensoes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            obraId: string;
            altura: import("@prisma/client/runtime/library").Decimal | null;
            largura: import("@prisma/client/runtime/library").Decimal | null;
            profundidade: import("@prisma/client/runtime/library").Decimal | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
            descricaoVariavel: string | null;
            tipo: import("@prisma/client").$Enums.TipoDimensao;
        }[];
    } & {
        id: string;
        projetoId: string;
        numeroManual: string;
        codigoAcervo: string;
        titulo: string | null;
        edicao: string | null;
        data: string | null;
        grupoObra: boolean;
        quantidadePartes: number | null;
        serie: boolean;
        tituloSerie: string | null;
        fichaMaeId: string | null;
        fotoPrincipalUrl: string | null;
        imagemPrincipalId: string | null;
        statusId: string | null;
        tecnicaId: string | null;
        localizacaoId: string | null;
        criadoEm: Date;
        atualizadoEm: Date;
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
    findOne(projetoId: string, obraId: string): Promise<Omit<{
        fichaMae: {
            id: string;
            codigo: string;
            descricao: string;
        } | null;
        imagemPrincipal: {
            id: string;
            imagemUrl: string;
            creditos: string | null;
        } | null;
        status: {
            id: string;
            nome: string;
        } | null;
        tecnica: {
            id: string;
            projetoId: string | null;
            nome: string;
        } | null;
        localizacao: {
            id: string;
            nome: string;
            paiId: string | null;
        } | null;
        artistas: {
            artista: {
                id: string;
                criadoEm: Date;
                atualizadoEm: Date;
                empresaId: string;
                nome: string;
                localNascimento: string | null;
                anoNascimento: number | null;
                localFalecimento: string | null;
                anoFalecimento: number | null;
            };
        }[];
        dimensoes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            obraId: string;
            altura: import("@prisma/client/runtime/library").Decimal | null;
            largura: import("@prisma/client/runtime/library").Decimal | null;
            profundidade: import("@prisma/client/runtime/library").Decimal | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
            descricaoVariavel: string | null;
            tipo: import("@prisma/client").$Enums.TipoDimensao;
        }[];
    } & {
        id: string;
        projetoId: string;
        numeroManual: string;
        codigoAcervo: string;
        titulo: string | null;
        edicao: string | null;
        data: string | null;
        grupoObra: boolean;
        quantidadePartes: number | null;
        serie: boolean;
        tituloSerie: string | null;
        fichaMaeId: string | null;
        fotoPrincipalUrl: string | null;
        imagemPrincipalId: string | null;
        statusId: string | null;
        tecnicaId: string | null;
        localizacaoId: string | null;
        criadoEm: Date;
        atualizadoEm: Date;
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
    }>;
    create(projetoId: string, dto: CreateWorkDto): Promise<Omit<{
        fichaMae: {
            id: string;
            codigo: string;
            descricao: string;
        } | null;
        imagemPrincipal: {
            id: string;
            imagemUrl: string;
            creditos: string | null;
        } | null;
        status: {
            id: string;
            nome: string;
        } | null;
        tecnica: {
            id: string;
            projetoId: string | null;
            nome: string;
        } | null;
        localizacao: {
            id: string;
            nome: string;
            paiId: string | null;
        } | null;
        artistas: {
            artista: {
                id: string;
                criadoEm: Date;
                atualizadoEm: Date;
                empresaId: string;
                nome: string;
                localNascimento: string | null;
                anoNascimento: number | null;
                localFalecimento: string | null;
                anoFalecimento: number | null;
            };
        }[];
        dimensoes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            obraId: string;
            altura: import("@prisma/client/runtime/library").Decimal | null;
            largura: import("@prisma/client/runtime/library").Decimal | null;
            profundidade: import("@prisma/client/runtime/library").Decimal | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
            descricaoVariavel: string | null;
            tipo: import("@prisma/client").$Enums.TipoDimensao;
        }[];
    } & {
        id: string;
        projetoId: string;
        numeroManual: string;
        codigoAcervo: string;
        titulo: string | null;
        edicao: string | null;
        data: string | null;
        grupoObra: boolean;
        quantidadePartes: number | null;
        serie: boolean;
        tituloSerie: string | null;
        fichaMaeId: string | null;
        fotoPrincipalUrl: string | null;
        imagemPrincipalId: string | null;
        statusId: string | null;
        tecnicaId: string | null;
        localizacaoId: string | null;
        criadoEm: Date;
        atualizadoEm: Date;
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
    }>;
    update(projetoId: string, obraId: string, dto: UpdateWorkDto): Promise<Omit<{
        fichaMae: {
            id: string;
            codigo: string;
            descricao: string;
        } | null;
        imagemPrincipal: {
            id: string;
            imagemUrl: string;
            creditos: string | null;
        } | null;
        status: {
            id: string;
            nome: string;
        } | null;
        tecnica: {
            id: string;
            projetoId: string | null;
            nome: string;
        } | null;
        localizacao: {
            id: string;
            nome: string;
            paiId: string | null;
        } | null;
        artistas: {
            artista: {
                id: string;
                criadoEm: Date;
                atualizadoEm: Date;
                empresaId: string;
                nome: string;
                localNascimento: string | null;
                anoNascimento: number | null;
                localFalecimento: string | null;
                anoFalecimento: number | null;
            };
        }[];
        dimensoes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            obraId: string;
            altura: import("@prisma/client/runtime/library").Decimal | null;
            largura: import("@prisma/client/runtime/library").Decimal | null;
            profundidade: import("@prisma/client/runtime/library").Decimal | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
            descricaoVariavel: string | null;
            tipo: import("@prisma/client").$Enums.TipoDimensao;
        }[];
    } & {
        id: string;
        projetoId: string;
        numeroManual: string;
        codigoAcervo: string;
        titulo: string | null;
        edicao: string | null;
        data: string | null;
        grupoObra: boolean;
        quantidadePartes: number | null;
        serie: boolean;
        tituloSerie: string | null;
        fichaMaeId: string | null;
        fotoPrincipalUrl: string | null;
        imagemPrincipalId: string | null;
        statusId: string | null;
        tecnicaId: string | null;
        localizacaoId: string | null;
        criadoEm: Date;
        atualizadoEm: Date;
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
    }>;
}
