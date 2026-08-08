import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import { ReactivateProjectDto } from './dto/reactivate-project.dto';
import { UpdateProjectUsersDto } from './dto/update-project-users.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
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
    archive(currentUser: AuthenticatedUser, projetoId: string): Promise<{
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
}
