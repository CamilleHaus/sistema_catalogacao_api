import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateTechniqueDto } from './dto/create-technique.dto';
import { ListTechniquesQueryDto } from './dto/list-techniques-query.dto';
import { UpdateTechniqueDto } from './dto/update-technique.dto';
import { TechniquesService } from './techniques.service';
export declare class TechniquesController {
    private readonly service;
    constructor(service: TechniquesService);
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
}
