import { TipoInstrucaoObra } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class NamedDto {
  @IsString() @MaxLength(100) nome!: string;
}
export class AnalysisDto {
  @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/) data?: string | null;
  @IsOptional() @IsUUID() estadoConservacaoId?: string | null;
  @IsOptional() @IsString() @MaxLength(300) avaliador?: string | null;
  @IsOptional() @IsString() @MaxLength(5000) observacoes?: string | null;
}
export class AnalysisImageDto {
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
    // O storage local responde em http://localhost:9000, que não tem TLD.
    require_tld: false,
  })
  @MaxLength(2048)
  imagemUrl!: string;
  @IsOptional() @IsString() @MaxLength(500) creditos?: string | null;
  @IsOptional() @IsString() @MaxLength(5000) comentarios?: string | null;
}
export class RestorationDto {
  @IsOptional() @IsString() @MaxLength(200) dataEntrada?: string | null;
  @IsOptional() @IsString() @MaxLength(200) dataSaida?: string | null;
  @IsOptional() @IsString() @MaxLength(500) localRestauro?: string | null;
  @IsOptional() @IsString() @MaxLength(2000) motivo?: string | null;
  @IsOptional() @IsString() @MaxLength(5000) observacoes?: string | null;
}
export class ReportDto {
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
    // O storage local responde em http://localhost:9000, que não tem TLD.
    require_tld: false,
  })
  @MaxLength(2048)
  url!: string;
}
export class ServiceDto {
  @IsOptional() @IsString() @MaxLength(200) data?: string | null;
  @IsOptional() @IsUUID() tipoServicoId?: string | null;
  @IsOptional() @IsString() @MaxLength(500) local?: string | null;
  @IsOptional() @IsString() @MaxLength(5000) observacoes?: string | null;
}
export class InstructionDto {
  @IsOptional() @IsEnum(TipoInstrucaoObra) tipo?: TipoInstrucaoObra | null;
  @IsOptional() @IsString() @MaxLength(200) data?: string | null;
  @IsOptional() @IsString() @MaxLength(300) profissionalResponsavel?:
    string | null;
  @IsOptional() @IsString() @MaxLength(5000) observacoes?: string | null;
}
export class InstructionImageDto {
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
    // O storage local responde em http://localhost:9000, que não tem TLD.
    require_tld: false,
  })
  @MaxLength(2048)
  imagemUrl!: string;
}
export class MovementDto {
  @IsOptional() @IsString() @MaxLength(200) data?: string | null;
  @IsOptional() @IsString() @MaxLength(300) realizadoPor?: string | null;
  @IsOptional() @IsString() @MaxLength(5000) observacoes?: string | null;
  @IsOptional() @IsUUID() localSaidaId?: string | null;
  @IsOptional() @IsUUID() localEntradaId?: string | null;
}
