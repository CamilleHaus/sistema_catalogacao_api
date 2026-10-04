import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';

/** Quais obras: uma lista explícita (a obra aberta ou o resultado na tela), um filtro salvo ou todas. */
export class ExportScopeDto {
  @IsIn(['obras', 'filtro', 'todas']) tipo!: 'obras' | 'filtro' | 'todas';

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5000)
  @IsUUID('4', { each: true })
  obraIds?: string[];

  @IsOptional() @IsUUID('4') filtroId?: string;
}

export class ExportDto {
  /** Por enquanto só a lista; fichas técnicas e etiquetas virão depois. */
  @IsIn(['lista']) formato!: 'lista';
  @IsIn(['pdf', 'csv']) saida!: 'pdf' | 'csv';

  /** PDF: incluir no fim da folha as demais imagens da obra. Padrão: sim. */
  @IsOptional() @IsBoolean() imagens?: boolean;

  @ValidateNested()
  @Type(() => ExportScopeDto)
  escopo!: ExportScopeDto;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  campos!: string[];
}
