import type { AuthenticatedUser } from '../auth/auth.types';
import { AuthorizationService } from '../auth/authorization.service';
import { PrismaService } from '../database/prisma.service';
import type { CreateArtistDto } from './dto/create-artist.dto';
import type { UpdateArtistDto } from './dto/update-artist.dto';
export declare class ArtistsService {
    private readonly prisma;
    private readonly authorization;
    constructor(prisma: PrismaService, authorization: AuthorizationService);
    list(user: AuthenticatedUser): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        localNascimento: string | null;
        anoNascimento: number | null;
        localFalecimento: string | null;
        anoFalecimento: number | null;
    }[]>;
    findOne(user: AuthenticatedUser, id: string): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        localNascimento: string | null;
        anoNascimento: number | null;
        localFalecimento: string | null;
        anoFalecimento: number | null;
    }>;
    create(user: AuthenticatedUser, dto: CreateArtistDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        localNascimento: string | null;
        anoNascimento: number | null;
        localFalecimento: string | null;
        anoFalecimento: number | null;
    }>;
    update(user: AuthenticatedUser, id: string, dto: UpdateArtistDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
        localNascimento: string | null;
        anoNascimento: number | null;
        localFalecimento: string | null;
        anoFalecimento: number | null;
    }>;
    private companyId;
    private data;
}
