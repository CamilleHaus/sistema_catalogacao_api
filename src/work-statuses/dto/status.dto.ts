import { IsString, MaxLength, MinLength } from 'class-validator';

export class StatusDto {
  @IsString() @MinLength(2) @MaxLength(100) nome!: string;
}
