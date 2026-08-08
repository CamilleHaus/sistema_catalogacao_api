import { Transform } from 'class-transformer';
import {
  IsArray,
  IsHexColor,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SaveCatalogingDto {
  @IsOptional() @IsUUID() categoriaId?: string | null;
  @IsOptional() @IsString() @MaxLength(10000) proveniencia?: string | null;
  @IsOptional() @IsString() @MaxLength(10000) observacoes?: string | null;
  @IsOptional() @IsArray() @IsUUID('4', { each: true }) tagIds?: string[];
}
export class SaveNameDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  nome!: string;
}
export class SaveTagDto extends SaveNameDto {
  @IsOptional() @IsHexColor() cor?: string | null;
}
export class CreateSignatureDto {
  @IsUUID() localAssinaturaId!: string;
  @IsOptional() @IsUrl({ require_tld: false }) @MaxLength(2048) imagemUrl?:
    string | null;
}
export class CreateCertificateDto {
  @IsUrl({ require_tld: false }) @MaxLength(2048) imagemUrl!: string;
  @IsOptional() @IsString() @MaxLength(10000) observacoes?: string | null;
}
