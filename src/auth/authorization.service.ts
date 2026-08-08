import { Injectable, NotFoundException } from '@nestjs/common';
import { PapelUsuario, PermissaoProjeto, StatusProjeto } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { AuthenticatedUser } from './auth.types';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  assertCompanyAccess(user: AuthenticatedUser, empresaId: string) {
    if (!user.empresaId || user.empresaId !== empresaId) {
      throw new NotFoundException('Recurso não encontrado.');
    }
  }

  async assertProjectAccess(
    user: AuthenticatedUser,
    projetoId: string,
    permissaoExigida: PermissaoProjeto = PermissaoProjeto.VISUALIZAR,
  ) {
    if (!user.empresaId || user.papel === PapelUsuario.ADMIN_GLOBAL) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    const projeto = await this.prisma.projeto.findFirst({
      where: {
        id: projetoId,
        empresaId: user.empresaId,
        ...(user.papel === PapelUsuario.USUARIO
          ? {
              status: StatusProjeto.ATIVO,
              usuarios: {
                some: {
                  usuarioId: user.id,
                  ...(permissaoExigida === PermissaoProjeto.EDITAR
                    ? { permissao: PermissaoProjeto.EDITAR }
                    : {}),
                },
              },
            }
          : {}),
      },
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return projeto;
  }

  async assertCompanyEditor(user: AuthenticatedUser) {
    if (!user.empresaId || user.papel === PapelUsuario.ADMIN_GLOBAL) {
      throw new NotFoundException('Empresa não encontrada.');
    }
    if (user.papel === PapelUsuario.ADMIN_EMPRESA) return;

    const editor = await this.prisma.usuarioProjeto.findFirst({
      where: {
        usuarioId: user.id,
        permissao: PermissaoProjeto.EDITAR,
        projeto: { empresaId: user.empresaId, status: StatusProjeto.ATIVO },
      },
      select: { id: true },
    });
    if (!editor) throw new NotFoundException('Recurso não encontrado.');
  }
}
