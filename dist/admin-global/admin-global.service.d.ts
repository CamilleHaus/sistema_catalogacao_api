import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import type { AppConfig } from '../config/app.config';
import { PrismaService } from '../database/prisma.service';
import type { CreateCompanyDto } from './dto/create-company.dto';
import type { ListUsersQueryDto } from './dto/list-users-query.dto';
export declare class AdminGlobalService {
    private readonly prisma;
    private readonly configService;
    constructor(prisma: PrismaService, configService: ConfigService<AppConfig, true>);
    createCompany(dto: CreateCompanyDto): Promise<{
        empresa: {
            id: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
        };
        primeiroAdmin: {
            cpfMascarado: string | null;
            email: string;
            id: string;
            empresaId: string | null;
            nome: string;
            papel: import("@prisma/client").$Enums.PapelUsuario;
            ativo: boolean;
            deveAlterarSenha: boolean;
            criadoEm: Date;
            atualizadoEm: Date;
        };
    }>;
    listCompanies(): Prisma.PrismaPromise<({
        _count: {
            projetos: number;
            usuarios: number;
        };
    } & {
        id: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    })[]>;
    listUsers(query: ListUsersQueryDto): Promise<{
        dados: {
            cpfMascarado: string | null;
            empresa: {
                id: string;
                nome: string;
            } | null;
            email: string;
            id: string;
            empresaId: string | null;
            nome: string;
            papel: import("@prisma/client").$Enums.PapelUsuario;
            ativo: boolean;
            deveAlterarSenha: boolean;
            criadoEm: Date;
            atualizadoEm: Date;
        }[];
        paginacao: {
            pagina: number;
            limite: number;
            total: number;
            totalPaginas: number;
        };
    }>;
    resetPassword(usuarioId: string): Promise<{
        message: string;
    }>;
    updateCompanyAdminStatus(usuarioId: string, ativo: boolean): Promise<{
        id: string;
        ativo: boolean;
    }>;
    private readonly safeUserSelect;
    private handleUniqueConstraint;
}
