import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  nome!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descricao?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  codigo!: string;
}
