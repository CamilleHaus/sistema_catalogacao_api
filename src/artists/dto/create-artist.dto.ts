import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateArtistDto {
  @IsString() @MinLength(2) @MaxLength(200) nome!: string;
  @IsOptional() @IsString() @MaxLength(200) localNascimento?: string;
  @IsOptional() @IsInt() @Min(0) @Max(9999) anoNascimento?: number;
  @IsOptional() @IsString() @MaxLength(200) localFalecimento?: string;
  @IsOptional() @IsInt() @Min(0) @Max(9999) anoFalecimento?: number;
}
