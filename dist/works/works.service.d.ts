import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { CreateWorkDto } from './dto/create-work.dto';
import type { ListWorksQueryDto } from './dto/list-works-query.dto';
import type { UpdateWorkDto } from './dto/update-work.dto';
export declare class WorksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(projetoId: string, query: ListWorksQueryDto): Promise<(Omit<{
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
        dimensoes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            obraId: string;
            tipo: import("@prisma/client").$Enums.TipoDimensao;
            altura: Prisma.Decimal | null;
            largura: Prisma.Decimal | null;
            profundidade: Prisma.Decimal | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
            descricaoVariavel: string | null;
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
        codigoAcervo: string;
        fotoPrincipalUrl: string | null;
    }, "artistas" | "dimensoes"> & {
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
        dimensoes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            obraId: string;
            tipo: import("@prisma/client").$Enums.TipoDimensao;
            altura: Prisma.Decimal | null;
            largura: Prisma.Decimal | null;
            profundidade: Prisma.Decimal | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
            descricaoVariavel: string | null;
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
        codigoAcervo: string;
        fotoPrincipalUrl: string | null;
    }, "artistas" | "dimensoes"> & {
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
        dimensoes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            obraId: string;
            tipo: import("@prisma/client").$Enums.TipoDimensao;
            altura: Prisma.Decimal | null;
            largura: Prisma.Decimal | null;
            profundidade: Prisma.Decimal | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
            descricaoVariavel: string | null;
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
        codigoAcervo: string;
        fotoPrincipalUrl: string | null;
    }, "artistas" | "dimensoes"> & {
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
        dimensoes: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            obraId: string;
            tipo: import("@prisma/client").$Enums.TipoDimensao;
            altura: Prisma.Decimal | null;
            largura: Prisma.Decimal | null;
            profundidade: Prisma.Decimal | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
            descricaoVariavel: string | null;
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
        codigoAcervo: string;
        fotoPrincipalUrl: string | null;
    }, "artistas" | "dimensoes"> & {
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
    private projectContext;
    private validateRelations;
    private readonly relations;
    private present;
    private text;
    private unique;
    private handleUnique;
}
