import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CombinacaoFiltro } from '@prisma/client';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export const MAX_CONDITIONS = 30;

export class SearchConditionDto {
  @IsString() @MaxLength(60) campo!: string;
  @IsString() @MaxLength(30) operador!: string;
  /** Formato depende do operador; validado contra o catálogo de campos. */
  @IsOptional() valor?: unknown;
}

export class AdvancedSearchDto {
  @IsEnum(CombinacaoFiltro) combinar!: CombinacaoFiltro;

  @IsArray()
  @ArrayMaxSize(MAX_CONDITIONS)
  @ValidateNested({ each: true })
  @Type(() => SearchConditionDto)
  condicoes!: SearchConditionDto[];
}

export class SaveSearchFilterDto extends AdvancedSearchDto {
  @Transform(trim) @IsString() @MinLength(1) @MaxLength(120) nome!: string;
}
