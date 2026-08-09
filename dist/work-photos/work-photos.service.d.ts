import { PrismaService } from '../database/prisma.service';
export declare class WorkPhotosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    update(projetoId: string, obraId: string, rawUrl: string, rawCredits?: string | null): Promise<{
        id: string;
        atualizadoEm: Date;
        fotoPrincipalUrl: string | null;
        imagemPrincipalId: string | null;
        imagemPrincipal: {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            obraId: string;
            imagemUrl: string;
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
