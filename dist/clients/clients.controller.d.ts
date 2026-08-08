import type { AuthenticatedUser } from '../auth/auth.types';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    list(currentUser: AuthenticatedUser): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            projetos: number;
        };
    } & {
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        descricao: string | null;
        codigo: string;
    })[]>;
    create(currentUser: AuthenticatedUser, dto: CreateClientDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        descricao: string | null;
        codigo: string;
    }>;
    findOne(currentUser: AuthenticatedUser, clienteId: string): Promise<{
        projetos: {
            id: string;
            nome: string;
            status: import("@prisma/client").$Enums.StatusProjeto;
        }[];
    } & {
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        descricao: string | null;
        codigo: string;
    }>;
    update(currentUser: AuthenticatedUser, clienteId: string, dto: UpdateClientDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        descricao: string | null;
        codigo: string;
    }>;
}
