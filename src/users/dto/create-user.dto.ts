import { PapelUsuario } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ProjectAccessDto } from '../../common/dto/project-access.dto';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  nome!: string;

  @IsEmail()
  email!: string;

  @IsIn([PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO])
  papel!: PapelUsuario;

  @IsString()
  @MinLength(8)
  senhaTemporaria!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectAccessDto)
  projetos?: ProjectAccessDto[];
}
