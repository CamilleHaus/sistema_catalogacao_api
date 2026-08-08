import type { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';
import type { CreateLocationDto } from './dto/create-location.dto';
import type { UpdateLocationDto } from './dto/update-location.dto';
type LocationRow = {
    id: string;
    projetoId: string;
    nome: string;
    paiId: string | null;
    criadoEm: Date;
    atualizadoEm: Date;
};
type LocationNode = LocationRow & {
    filhos: LocationNode[];
};
export declare class LocationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listTree(projetoId: string): Promise<LocationNode[]>;
    create(user: AuthenticatedUser, projetoId: string, dto: CreateLocationDto): Promise<{
        id: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        projetoId: string;
        paiId: string | null;
    }>;
    update(user: AuthenticatedUser, projetoId: string, localizacaoId: string, dto: UpdateLocationDto): Promise<{
        id: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        projetoId: string;
        paiId: string | null;
    }>;
    private assertNoCycle;
    private requireLocation;
    private buildTree;
    private assertCompany;
    private handleUnique;
}
export {};
