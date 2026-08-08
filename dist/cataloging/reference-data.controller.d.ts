import type { AuthenticatedUser } from '../auth/auth.types';
import { SaveNameDto, SaveTagDto } from './dto/cataloging.dto';
import { ReferenceDataService } from './reference-data.service';
export declare class ReferenceDataController {
    private readonly service;
    constructor(service: ReferenceDataService);
    categories(user: AuthenticatedUser): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }[]>;
    createCategory(user: AuthenticatedUser, dto: SaveNameDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    updateCategory(user: AuthenticatedUser, id: string, dto: SaveNameDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    tags(user: AuthenticatedUser): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }[]>;
    createTag(user: AuthenticatedUser, dto: SaveTagDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    updateTag(user: AuthenticatedUser, id: string, dto: SaveTagDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    locations(user: AuthenticatedUser): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }[]>;
    createLocation(user: AuthenticatedUser, dto: SaveNameDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    updateLocation(user: AuthenticatedUser, id: string, dto: SaveNameDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    negotiationForms(user: AuthenticatedUser): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }[]>;
    createNegotiationForm(user: AuthenticatedUser, dto: SaveNameDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    updateNegotiationForm(user: AuthenticatedUser, id: string, dto: SaveNameDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    insuranceTypes(user: AuthenticatedUser): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }[]>;
    createInsuranceType(user: AuthenticatedUser, dto: SaveNameDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    updateInsuranceType(user: AuthenticatedUser, id: string, dto: SaveNameDto): Promise<{
        id: string;
        empresaId: string;
        nome: string;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
}
