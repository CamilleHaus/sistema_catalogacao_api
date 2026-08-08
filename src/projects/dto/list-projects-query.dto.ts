import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { StatusProjeto } from '@prisma/client';

export class ListProjectsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  busca?: string;

  @IsOptional()
  @IsIn([StatusProjeto.ATIVO, StatusProjeto.ARQUIVADO])
  status?: StatusProjeto;
}
