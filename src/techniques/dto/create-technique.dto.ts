import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTechniqueDto {
  @IsString() @MinLength(2) @MaxLength(150) nome!: string;
  @IsOptional() @IsUUID('4') projetoId?: string;
}
