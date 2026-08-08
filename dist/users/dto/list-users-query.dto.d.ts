import { PapelUsuario } from '@prisma/client';
export declare class ListCompanyUsersQueryDto {
    busca?: string;
    papel?: PapelUsuario;
    ativo?: boolean;
    pagina: number;
    limite: number;
}
