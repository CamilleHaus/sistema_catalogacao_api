import { UnidadeMedida } from '@prisma/client';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/**
 * A dimensão vem achatada no corpo, como em `UpsertDimensionDto`. Sem nenhum
 * campo de medida, a ficha mãe fica sem dimensão.
 */
export class SaveWorkSetDto {
  @IsUUID('4') projetoId!: string;
  @IsString() @MinLength(1) @MaxLength(100) codigo!: string;
  @IsString() @MinLength(1) @MaxLength(5000) descricao!: string;
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  imagemUrl?: string | null;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 3 }) @Min(0.001) altura?: number;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 3 }) @Min(0.001) largura?: number;
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  profundidade?: number;
  @IsOptional()
  @IsIn([UnidadeMedida.CM, UnidadeMedida.IN])
  unidade?: UnidadeMedida;
  @IsOptional() @IsString() @MaxLength(500) descricaoVariavel?: string;
}

export class ListWorkSetsQueryDto {
  @IsOptional() @IsUUID('4') projetoId?: string;
}
