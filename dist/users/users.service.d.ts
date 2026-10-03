import type { ProjectAccessDto } from '../common/dto/project-access.dto';
import type { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { ListCompanyUsersQueryDto } from './dto/list-users-query.dto';
import type { UpdateRoleDto } from './dto/update-role.dto';
import type { UpdateUserProjectsDto } from './dto/update-user-projects.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(currentUser: AuthenticatedUser, query: ListCompanyUsersQueryDto): Promise<{
        dados: {
            id: string;
            email: string;
            empresaId: string | null;
            nome: string;
            papel: import("@prisma/client").$Enums.PapelUsuario;
            ativo: boolean;
            deveAlterarSenha: boolean;
            criadoEm: Date;
            atualizadoEm: Date;
            _count: {
                projetos: number;
            };
        }[];
        paginacao: {
            pagina: number;
            limite: number;
            total: number;
            totalPaginas: number;
        };
    }>;
    create(currentUser: AuthenticatedUser, dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    findOne(currentUser: AuthenticatedUser, usuarioId: string): Promise<{
        id: string;
        email: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
        projetos: {
            projeto: {
                id: string;
                nome: string;
                status: import("@prisma/client").$Enums.StatusProjeto;
            };
            criadoEm: Date;
            permissao: import("@prisma/client").$Enums.PermissaoProjeto;
        }[];
    }>;
    update(currentUser: AuthenticatedUser, usuarioId: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    updateRole(currentUser: AuthenticatedUser, usuarioId: string, dto: UpdateRoleDto): Promise<{
        id: string;
        email: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    deactivate(currentUser: AuthenticatedUser, usuarioId: string): Promise<{
        id: string;
        email: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    reactivate(currentUser: AuthenticatedUser, usuarioId: string, rawProjectAccesses: ProjectAccessDto[]): Promise<{
        id: string;
        email: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    updateProjects(currentUser: AuthenticatedUser, usuarioId: string, dto: UpdateUserProjectsDto): Promise<{
        id: string;
        email: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    private readonly safeUserSelect;
    private getCompanyId;
    private requireScopedUser;
    private validateActiveProjects;
    private revokeSessions;
    private uniqueIds;
    private uniqueProjectAccesses;
    private handleUniqueConstraint;
}
