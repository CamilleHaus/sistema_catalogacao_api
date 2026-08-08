import { PermissaoProjeto } from '@prisma/client';
export declare class ProjectAccessDto {
    projetoId: string;
    permissao: PermissaoProjeto;
}
export declare class UserProjectAccessDto {
    usuarioId: string;
    permissao: PermissaoProjeto;
}
