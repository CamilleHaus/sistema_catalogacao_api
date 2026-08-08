import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  nome!: string;

  @IsOptional()
  @IsUUID('4')
  paiId?: string;
}
