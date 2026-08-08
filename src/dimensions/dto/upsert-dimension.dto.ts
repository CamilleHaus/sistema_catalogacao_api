import { UnidadeMedida } from '@prisma/client';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpsertDimensionDto {
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
