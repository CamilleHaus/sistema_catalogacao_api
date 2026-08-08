import { PermissaoProjeto } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { AuthenticatedUser } from './auth.types';
export declare class AuthorizationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    assertCompanyAccess(user: AuthenticatedUser, empresaId: string): void;
    assertProjectAccess(user: AuthenticatedUser, projetoId: string, permissaoExigida?: PermissaoProjeto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        clienteId: string;
        status: import("@prisma/client").$Enums.StatusProjeto;
    }>;
    assertCompanyEditor(user: AuthenticatedUser): Promise<void>;
}
