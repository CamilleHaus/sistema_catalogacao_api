import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Moeda, TipoDesconto } from '@prisma/client';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class SaveTransactionDto {
  @IsOptional() @IsUUID() formaNegociacaoId?: string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(200) data?:
    string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(500) contraparte?:
    string | null;
  @IsOptional() @IsEnum(Moeda) moeda?: Moeda | null;
  @Transform(trim) @IsOptional() @IsNumberString() valor?: string | null;
  @IsOptional() @IsEnum(TipoDesconto) tipoDesconto?: TipoDesconto | null;
  @Transform(trim) @IsOptional() @IsNumberString() desconto?: string | null;
  /** Só na aquisição; a venda ignora. */
  @IsOptional() @IsEnum(TipoDesconto) tipoComissao?: TipoDesconto | null;
  @Transform(trim) @IsOptional() @IsNumberString() comissao?: string | null;
}

export class SaveDocumentDto {
  @Transform(trim)
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  imagemUrl?: string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(200) numero?:
    string | null;
  @IsOptional() @IsDateString({ strict: true }) data?: string | null;
  @IsOptional() @IsEnum(Moeda) moeda?: Moeda | null;
  @Transform(trim) @IsOptional() @IsNumberString() valor?: string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(10000) comentarios?:
    string | null;
}

export class SaveEvaluationDto {
  @IsOptional() @IsDateString({ strict: true }) data?: string | null;
  @IsOptional() @IsEnum(Moeda) moeda?: Moeda | null;
  @Transform(trim) @IsOptional() @IsNumberString() valor?: string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(500) avaliador?:
    string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(10000) comentarios?:
    string | null;
}

export class SaveInsuranceDto {
  @Transform(trim) @IsOptional() @IsString() @MaxLength(500) vigencia?:
    string | null;
  @IsOptional() @IsEnum(Moeda) moeda?: Moeda | null;
  @Transform(trim) @IsOptional() @IsNumberString() valor?: string | null;
  @IsOptional() @IsUUID() modalidadeSeguroId?: string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(10000) observacoes?:
    string | null;
}
