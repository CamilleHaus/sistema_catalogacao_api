import { Prisma } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';
import type { StatusDto } from './dto/status.dto';
export declare class WorkStatusesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(user: AuthenticatedUser): Prisma.PrismaPromise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }[]>;
    create(user: AuthenticatedUser, dto: StatusDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    update(user: AuthenticatedUser, id: string, dto: StatusDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    private companyId;
    private unique;
}
