import { Prisma } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AuthorizationService } from '../auth/authorization.service';
import { PrismaService } from '../database/prisma.service';
import type { ListWorkSetsQueryDto, SaveWorkSetDto } from './dto/work-set.dto';
export declare class WorkSetsService {
    private readonly prisma;
    private readonly authorization;
    constructor(prisma: PrismaService, authorization: AuthorizationService);
    list(user: AuthenticatedUser, query: ListWorkSetsQueryDto): Promise<(Omit<{
        projeto: {
            id: string;
            nome: string;
        };
        _count: {
            obras: number;
        };
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        projetoId: string;
        descricao: string;
        codigo: string;
        imagemUrl: string | null;
        altura: Prisma.Decimal | null;
        largura: Prisma.Decimal | null;
        profundidade: Prisma.Decimal | null;
        unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
        descricaoVariavel: string | null;
    }, "_count" | "altura" | "largura" | "profundidade" | "unidade" | "descricaoVariavel"> & {
        dimensao: ({
            altura: {
                toNumber(): number;
            } | null;
            largura: {
                toNumber(): number;
            } | null;
            profundidade: {
                toNumber(): number;
            } | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
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
        }) | null;
        totalObras: number;
    })[]>;
    findOne(user: AuthenticatedUser, id: string): Promise<{
        obras: {
            id: string;
            projetoId: string;
            titulo: string | null;
            codigoAcervo: string;
        }[];
        projeto: {
            id: string;
            nome: string;
        };
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        projetoId: string;
        descricao: string;
        codigo: string;
        imagemUrl: string | null;
        dimensao: ({
            altura: {
                toNumber(): number;
            } | null;
            largura: {
                toNumber(): number;
            } | null;
            profundidade: {
                toNumber(): number;
            } | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
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
        }) | null;
        totalObras: number;
    }>;
    create(user: AuthenticatedUser, dto: SaveWorkSetDto): Promise<Omit<{
        projeto: {
            id: string;
            nome: string;
        };
        _count: {
            obras: number;
        };
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        projetoId: string;
        descricao: string;
        codigo: string;
        imagemUrl: string | null;
        altura: Prisma.Decimal | null;
        largura: Prisma.Decimal | null;
        profundidade: Prisma.Decimal | null;
        unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
        descricaoVariavel: string | null;
    }, "_count" | "altura" | "largura" | "profundidade" | "unidade" | "descricaoVariavel"> & {
        dimensao: ({
            altura: {
                toNumber(): number;
            } | null;
            largura: {
                toNumber(): number;
            } | null;
            profundidade: {
                toNumber(): number;
            } | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
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
        }) | null;
        totalObras: number;
    }>;
    update(user: AuthenticatedUser, id: string, dto: SaveWorkSetDto): Promise<Omit<{
        projeto: {
            id: string;
            nome: string;
        };
        _count: {
            obras: number;
        };
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        projetoId: string;
        descricao: string;
        codigo: string;
        imagemUrl: string | null;
        altura: Prisma.Decimal | null;
        largura: Prisma.Decimal | null;
        profundidade: Prisma.Decimal | null;
        unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
        descricaoVariavel: string | null;
    }, "_count" | "altura" | "largura" | "profundidade" | "unidade" | "descricaoVariavel"> & {
        dimensao: ({
            altura: {
                toNumber(): number;
            } | null;
            largura: {
                toNumber(): number;
            } | null;
            profundidade: {
                toNumber(): number;
            } | null;
            unidade: import("@prisma/client").$Enums.UnidadeMedida | null;
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
        }) | null;
        totalObras: number;
    }>;
    private fields;
    private unique;
    private visibleProjects;
    private readonly relations;
    private present;
}
