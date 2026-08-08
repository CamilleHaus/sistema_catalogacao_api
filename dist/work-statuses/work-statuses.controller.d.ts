import type { AuthenticatedUser } from '../auth/auth.types';
import { StatusDto } from './dto/status.dto';
import { WorkStatusesService } from './work-statuses.service';
export declare class WorkStatusesController {
    private readonly service;
    constructor(service: WorkStatusesService);
    list(user: AuthenticatedUser): import("@prisma/client").Prisma.PrismaPromise<{
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
}
