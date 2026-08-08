import type { PapelUsuario } from '@prisma/client';
import type { Request } from 'express';
export interface AccessTokenPayload {
    sub: string;
    sid: string;
}
export interface AuthenticatedUser {
    id: string;
    empresaId: string | null;
    nome: string;
    email: string;
    papel: PapelUsuario;
    ativo: boolean;
    deveAlterarSenha: boolean;
    sessaoId: string;
}
export type AuthenticatedRequest = Request & {
    user: AuthenticatedUser;
};
