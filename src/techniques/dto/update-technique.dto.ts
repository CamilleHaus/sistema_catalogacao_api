import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTechniqueDto {
  @IsString() @MinLength(2) @MaxLength(150) nome!: string;
}
