import { Prisma } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';
import type { CreateClientDto } from './dto/create-client.dto';
import type { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(currentUser: AuthenticatedUser): Prisma.PrismaPromise<({
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
    private getCompanyId;
    private normalizeDescription;
    private handleUniqueConstraint;
}
