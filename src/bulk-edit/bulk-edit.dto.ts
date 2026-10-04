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

/** Registro de movimentação criado para cada obra que muda de localização. */
export class BulkMovementDto {
  @IsBoolean() registrar!: boolean;
  @IsOptional() @IsString() @MaxLength(200) data?: string | null;
  @IsOptional() @IsString() @MaxLength(300) realizadoPor?: string | null;
  @IsOptional() @IsString() @MaxLength(5000) observacoes?: string | null;
}

export class BulkEditDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5000)
  @IsUUID('4', { each: true })
  obraIds!: string[];

  @IsString() @MaxLength(60) campo!: string;

  /** Texto, número, id ou lista de ids conforme o campo; null limpa. */
  @IsOptional() valor?: unknown;

  /** Só para listas (artistas, tags). */
  @IsOptional()
  @IsIn(['adicionar', 'remover', 'substituir'])
  modo?: 'adicionar' | 'remover' | 'substituir';

  @IsOptional()
  @ValidateNested()
  @Type(() => BulkMovementDto)
  movimentacao?: BulkMovementDto;
}
