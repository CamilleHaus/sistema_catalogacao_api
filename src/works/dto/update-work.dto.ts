import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateWorkDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) numeroManual?: string;
  @IsOptional() @IsString() @MaxLength(300) titulo?: string | null;
  @IsOptional() @IsString() @MaxLength(150) edicao?: string | null;
  @IsOptional() @IsString() @MaxLength(150) data?: string | null;
  @IsOptional() @IsUUID('4') statusId?: string | null;
  @IsOptional() @IsUUID('4') tecnicaId?: string | null;
  @IsOptional() @IsUUID('4') localizacaoId?: string | null;
  @IsOptional() @IsArray() @IsUUID('4', { each: true }) artistaIds?: string[];
}
