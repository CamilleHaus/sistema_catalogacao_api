import type { AuthenticatedUser } from '../auth/auth.types';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
export declare class ArtistsController {
    private readonly service;
    constructor(service: ArtistsService);
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
}
