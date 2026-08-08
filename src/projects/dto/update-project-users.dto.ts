import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { UserProjectAccessDto } from '../../common/dto/project-access.dto';

export class UpdateProjectUsersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserProjectAccessDto)
  usuarios!: UserProjectAccessDto[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  confirmarDesativacaoUsuarioIds?: string[];
}
