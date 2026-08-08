import { Prisma } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AuthorizationService } from '../auth/authorization.service';
import { PrismaService } from '../database/prisma.service';
import type { SaveNameDto, SaveTagDto } from './dto/cataloging.dto';
export declare class ReferenceDataService {
    private readonly prisma;
    private readonly authorization;
    constructor(prisma: PrismaService, authorization: AuthorizationService);
    private companyId;
    list(user: AuthenticatedUser, kind: 'categoria' | 'tag' | 'local' | 'forma' | 'modalidade'): Prisma.PrismaPromise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }[]>;
    create(user: AuthenticatedUser, kind: 'categoria' | 'tag' | 'local' | 'forma' | 'modalidade', dto: SaveNameDto | SaveTagDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    update(user: AuthenticatedUser, kind: 'categoria' | 'tag' | 'local' | 'forma' | 'modalidade', id: string, dto: SaveNameDto | SaveTagDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    private require;
    private unique;
}
