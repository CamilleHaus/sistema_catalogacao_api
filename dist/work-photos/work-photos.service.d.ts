import { PrismaService } from '../database/prisma.service';
export declare class WorkPhotosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    update(projetoId: string, obraId: string, rawUrl: string): Promise<{
        id: string;
        atualizadoEm: Date;
        fotoPrincipalUrl: string | null;
    }>;
    remove(projetoId: string, obraId: string): Promise<{
        id: string;
        atualizadoEm: Date;
        fotoPrincipalUrl: string | null;
    }>;
    private requireWork;
}
