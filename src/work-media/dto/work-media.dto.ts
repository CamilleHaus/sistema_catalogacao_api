import { TipoArquivoAnexo } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateWorkImageDto {
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2048)
  imagemUrl!: string;

  @IsOptional() @IsString() @MaxLength(500) creditos?: string | null;
  @IsOptional() @IsString() @MaxLength(5000) observacoes?: string | null;
}

export class UpdateWorkImageDto {
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2048)
  imagemUrl?: string;

  @IsOptional() @IsString() @MaxLength(500) creditos?: string | null;
  @IsOptional() @IsString() @MaxLength(5000) observacoes?: string | null;
}

export class CreateWorkAttachmentDto {
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2048)
  arquivoUrl!: string;

  @IsEnum(TipoArquivoAnexo) tipo!: TipoArquivoAnexo;
  @IsOptional() @IsString() @MaxLength(5000) observacoes?: string | null;
}

export class UpdateWorkAttachmentDto extends CreateWorkAttachmentDto {}
