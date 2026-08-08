import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { ProjectAccessDto } from '../../common/dto/project-access.dto';

export class ReactivateUserDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProjectAccessDto)
  projetos!: ProjectAccessDto[];
}
