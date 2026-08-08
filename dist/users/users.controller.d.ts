import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateUserDto } from './dto/create-user.dto';
import { ListCompanyUsersQueryDto } from './dto/list-users-query.dto';
import { ReactivateUserDto } from './dto/reactivate-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserProjectsDto } from './dto/update-user-projects.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    list(currentUser: AuthenticatedUser, query: ListCompanyUsersQueryDto): Promise<{
        dados: {
            email: string;
            id: string;
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
        email: string;
        id: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    findOne(currentUser: AuthenticatedUser, usuarioId: string): Promise<{
        email: string;
        id: string;
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
        email: string;
        id: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    updateRole(currentUser: AuthenticatedUser, usuarioId: string, dto: UpdateRoleDto): Promise<{
        email: string;
        id: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    deactivate(currentUser: AuthenticatedUser, usuarioId: string): Promise<{
        email: string;
        id: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    reactivate(currentUser: AuthenticatedUser, usuarioId: string, dto: ReactivateUserDto): Promise<{
        email: string;
        id: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    updateProjects(currentUser: AuthenticatedUser, usuarioId: string, dto: UpdateUserProjectsDto): Promise<{
        email: string;
        id: string;
        empresaId: string | null;
        nome: string;
        papel: import("@prisma/client").$Enums.PapelUsuario;
        ativo: boolean;
        deveAlterarSenha: boolean;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
}
