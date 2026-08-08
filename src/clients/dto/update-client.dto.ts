import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  nome?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descricao?: string | null;
}
