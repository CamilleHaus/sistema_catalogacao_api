import type { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import type { ReactivateProjectDto } from './dto/reactivate-project.dto';
import type { UpdateProjectUsersDto } from './dto/update-project-users.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(currentUser: AuthenticatedUser, query: ListProjectsQueryDto): Promise<{
        permissao?: import("@prisma/client").$Enums.PermissaoProjeto | undefined;
        cliente: {
            id: string;
            nome: string;
            codigo: string;
        };
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        status: import("@prisma/client").$Enums.StatusProjeto;
        _count: {
            empresa: number;
            cliente: number;
            usuarios: number;
            tecnicas: number;
            localizacoes: number;
            obras: number;
        };
    }[]>;
    create(currentUser: AuthenticatedUser, dto: CreateProjectDto): Promise<{
        cliente: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
            descricao: string | null;
            codigo: string;
        };
    } & {
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        clienteId: string;
        status: import("@prisma/client").$Enums.StatusProjeto;
    }>;
    findOne(currentUser: AuthenticatedUser, projetoId: string): Promise<{
        permissao?: import("@prisma/client").$Enums.PermissaoProjeto | undefined;
        cliente: {
            id: string;
            nome: string;
            codigo: string;
        };
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        status: import("@prisma/client").$Enums.StatusProjeto;
        _count: {
            empresa: number;
            cliente: number;
            usuarios: number;
            tecnicas: number;
            localizacoes: number;
            obras: number;
        };
    }>;
    update(currentUser: AuthenticatedUser, projetoId: string, dto: UpdateProjectDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        clienteId: string;
        status: import("@prisma/client").$Enums.StatusProjeto;
    }>;
    archive(currentUser: AuthenticatedUser, projetoId: string): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        clienteId: string;
        status: import("@prisma/client").$Enums.StatusProjeto;
    }>;
    reactivationPreview(currentUser: AuthenticatedUser, projetoId: string): Promise<{
        projeto: {
            id: string;
            empresaId: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
            clienteId: string;
            status: import("@prisma/client").$Enums.StatusProjeto;
        };
        usuariosComVinculo: {
            permissao: import("@prisma/client").$Enums.PermissaoProjeto;
            email: string;
            id: string;
            nome: string;
            papel: import("@prisma/client").$Enums.PapelUsuario;
            ativo: boolean;
        }[];
    }>;
    reactivate(currentUser: AuthenticatedUser, projetoId: string, dto: ReactivateProjectDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        clienteId: string;
        status: import("@prisma/client").$Enums.StatusProjeto;
    }>;
    listUsers(currentUser: AuthenticatedUser, projetoId: string): Promise<{
        usuario: {
            email: string;
            id: string;
            nome: string;
            papel: import("@prisma/client").$Enums.PapelUsuario;
            ativo: boolean;
        };
        criadoEm: Date;
        permissao: import("@prisma/client").$Enums.PermissaoProjeto;
    }[]>;
    updateUsers(currentUser: AuthenticatedUser, projetoId: string, dto: UpdateProjectUsersDto): Promise<{
        usuario: {
            email: string;
            id: string;
            nome: string;
            papel: import("@prisma/client").$Enums.PapelUsuario;
            ativo: boolean;
        };
        criadoEm: Date;
        permissao: import("@prisma/client").$Enums.PermissaoProjeto;
    }[]>;
    private accessWhere;
    private requireCompanyProject;
    private validateActiveCommonUsers;
    private getCompanyId;
    private uniqueIds;
    private uniqueUserAccesses;
    private handleUniqueConstraint;
}
