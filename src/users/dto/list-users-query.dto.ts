import { Transform, type TransformFnParams, Type } from 'class-transformer';
import { PapelUsuario } from '@prisma/client';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

function parseBoolean({ value }: TransformFnParams): unknown {
  const rawValue: unknown = value;
  if (rawValue === true || rawValue === 'true') return true;
  if (rawValue === false || rawValue === 'false') return false;
  return rawValue;
}

export class ListCompanyUsersQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  busca?: string;

  @IsOptional()
  @IsIn([PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO])
  papel?: PapelUsuario;

  @IsOptional()
  @Transform(parseBoolean)
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limite = 20;
}
