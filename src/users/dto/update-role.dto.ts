import { PapelUsuario } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional, ValidateNested } from 'class-validator';
import { ProjectAccessDto } from '../../common/dto/project-access.dto';

export class UpdateRoleDto {
  @IsIn([PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO])
  papel!: PapelUsuario;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectAccessDto)
  projetos?: ProjectAccessDto[];
}
