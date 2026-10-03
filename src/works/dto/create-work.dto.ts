import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateWorkDto {
  @IsString() @MinLength(1) @MaxLength(100) numeroManual!: string;
  @IsOptional() @IsString() @MaxLength(300) titulo?: string;
  @IsOptional() @IsString() @MaxLength(150) edicao?: string;
  @IsOptional() @IsString() @MaxLength(150) data?: string;
  @IsOptional() @IsInt() @Min(2) @Max(9999) quantidadePartes?: number;
  @IsOptional() @IsString() @MaxLength(300) tituloSerie?: string;
  @IsOptional() @IsUUID('4') fichaMaeId?: string | null;
  @IsOptional() @IsUUID('4') statusId?: string;
  @IsOptional() @IsUUID('4') tecnicaId?: string;
  @IsOptional() @IsUUID('4') localizacaoId?: string;
  @IsOptional() @IsArray() @IsUUID('4', { each: true }) artistaIds?: string[];
}
