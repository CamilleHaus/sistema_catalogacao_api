import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ProjectAccessDto } from '../../common/dto/project-access.dto';

export class UpdateUserProjectsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectAccessDto)
  projetos!: ProjectAccessDto[];

  @IsOptional()
  @IsBoolean()
  confirmarDesativacao?: boolean;
}
