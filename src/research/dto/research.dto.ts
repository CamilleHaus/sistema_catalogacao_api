import { Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

class OptionalTextDto {
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  titulo?: string | null;
}

export class SaveCurriculumDto {
  @Transform(trim) @IsOptional() @IsString() @MaxLength(500) nomeExposicao?:
    string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(500) instituicao?:
    string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(200) cidade?:
    string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(200) pais?:
    string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(200) data?:
    string | null;
}

export class SavePublicationDto extends OptionalTextDto {
  @Transform(({ value }: { value: unknown }) =>
    value === null || value === '' || value === undefined
      ? value
      : Number(value),
  )
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(9999)
  ano?: number | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(500) autor?:
    string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(500) editora?:
    string | null;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(200) pagina?:
    string | null;
  @Transform(({ value }: { value: unknown }) => {
    if (!Array.isArray(value)) return value;
    const items: unknown[] = value;
    return items
      .map((item) => (typeof item === 'string' ? item.trim() : item))
      .filter(Boolean);
  })
  @IsOptional()
  @IsArray()
  @IsUrl(
    { require_tld: false },
    { each: true, message: 'Informe somente URLs de imagem válidas.' },
  )
  @MaxLength(2048, { each: true })
  imagens?: string[];
}

export class SaveMuseumResearchDto extends OptionalTextDto {
  @Transform(trim) @IsOptional() @IsString() @MaxLength(10000) descricao?:
    string | null;
  @Transform(trim)
  @IsOptional()
  @IsUrl({ require_tld: false }, { message: 'Informe uma URL válida.' })
  @MaxLength(2048)
  url?: string | null;
}

export class AddPublicationImageDto {
  @Transform(trim)
  @IsUrl(
    { require_tld: false },
    { message: 'Informe uma URL de imagem válida.' },
  )
  @MaxLength(2048)
  imagemUrl!: string;
}
