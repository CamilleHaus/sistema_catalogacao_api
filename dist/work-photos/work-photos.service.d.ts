import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
export declare class WorkPhotosService {
    private readonly prisma;
    private readonly storage;
    constructor(prisma: PrismaService, storage: StorageService);
    update(projetoId: string, obraId: string, rawUrl: string, rawCredits?: string | null): Promise<{
        id: string;
        atualizadoEm: Date;
        fotoPrincipalUrl: string | null;
        imagemPrincipalId: string | null;
        imagemPrincipal: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            imagemUrl: string;
            obraId: string;
            creditos: string | null;
            observacoes: string | null;
        } | null;
    }>;
    remove(projetoId: string, obraId: string): Promise<{
        id: string;
        atualizadoEm: Date;
        fotoPrincipalUrl: string | null;
        imagemPrincipalId: string | null;
    }>;
    private requireWork;
}
