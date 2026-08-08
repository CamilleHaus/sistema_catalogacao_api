import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListWorksQueryDto {
  @IsOptional() @IsString() @MaxLength(150) busca?: string;
}
