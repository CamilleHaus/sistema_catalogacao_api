import { IsOptional, IsUUID } from 'class-validator';

export class ListTechniquesQueryDto {
  @IsOptional() @IsUUID('4') projetoId?: string;
}
