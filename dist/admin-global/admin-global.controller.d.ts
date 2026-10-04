import { AdminGlobalService } from './admin-global.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateAdminStatusDto } from './dto/update-admin-status.dto';
export declare class AdminGlobalController {
    private readonly adminGlobalService;
    constructor(adminGlobalService: AdminGlobalService);
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
    listCompanies(): import("@prisma/client").Prisma.PrismaPromise<({
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
    updateCompanyAdminStatus(usuarioId: string, dto: UpdateAdminStatusDto): Promise<{
        id: string;
        ativo: boolean;
    }>;
}
