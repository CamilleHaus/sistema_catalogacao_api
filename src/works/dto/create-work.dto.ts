import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWorkDto {
  @IsString() @MinLength(1) @MaxLength(100) numeroManual!: string;
  @IsOptional() @IsString() @MaxLength(300) titulo?: string;
  @IsOptional() @IsString() @MaxLength(150) edicao?: string;
  @IsOptional() @IsString() @MaxLength(150) data?: string;
  @IsOptional() @IsUUID('4') statusId?: string;
  @IsOptional() @IsUUID('4') tecnicaId?: string;
  @IsOptional() @IsUUID('4') localizacaoId?: string;
  @IsOptional() @IsArray() @IsUUID('4', { each: true }) artistaIds?: string[];
}
