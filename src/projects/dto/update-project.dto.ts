import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  nome!: string;
}
