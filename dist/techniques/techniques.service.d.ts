import type { AuthenticatedUser } from '../auth/auth.types';
import { AuthorizationService } from '../auth/authorization.service';
import { PrismaService } from '../database/prisma.service';
import type { CreateTechniqueDto } from './dto/create-technique.dto';
import type { ListTechniquesQueryDto } from './dto/list-techniques-query.dto';
import type { UpdateTechniqueDto } from './dto/update-technique.dto';
export declare class TechniquesService {
    private readonly prisma;
    private readonly authorization;
    constructor(prisma: PrismaService, authorization: AuthorizationService);
    list(user: AuthenticatedUser, query: ListTechniquesQueryDto): Promise<({
        projeto: {
            id: string;
            nome: string;
        } | null;
    } & {
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        projetoId: string | null;
    })[]>;
    create(user: AuthenticatedUser, dto: CreateTechniqueDto): Promise<{
        projeto: {
            id: string;
            nome: string;
        } | null;
    } & {
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        projetoId: string | null;
    }>;
    update(user: AuthenticatedUser, id: string, dto: UpdateTechniqueDto): Promise<{
        projeto: {
            id: string;
            nome: string;
        } | null;
    } & {
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        projetoId: string | null;
    }>;
    private companyId;
    private unique;
}
