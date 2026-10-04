import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';
export declare class LocationsController {
    private readonly service;
    constructor(service: LocationsService);
    list(projetoId: string): Promise<({
        id: string;
        projetoId: string;
        nome: string;
        paiId: string | null;
        criadoEm: Date;
        atualizadoEm: Date;
        vinculos: number;
    } & {
        filhos: ({
            id: string;
            projetoId: string;
            nome: string;
            paiId: string | null;
            criadoEm: Date;
            atualizadoEm: Date;
            vinculos: number;
        } & any)[];
    })[]>;
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
    remove(user: AuthenticatedUser, projetoId: string, localizacaoId: string): Promise<void>;
}
