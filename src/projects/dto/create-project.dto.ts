import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  nome!: string;

  @IsUUID('4')
  clienteId!: string;
}
