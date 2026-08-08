import { PermissaoProjeto } from '@prisma/client';
import { IsIn, IsUUID } from 'class-validator';

export class ProjectAccessDto {
  @IsUUID('4')
  projetoId!: string;

  @IsIn([PermissaoProjeto.VISUALIZAR, PermissaoProjeto.EDITAR])
  permissao!: PermissaoProjeto;
}

export class UserProjectAccessDto {
  @IsUUID('4')
  usuarioId!: string;

  @IsIn([PermissaoProjeto.VISUALIZAR, PermissaoProjeto.EDITAR])
  permissao!: PermissaoProjeto;
}
