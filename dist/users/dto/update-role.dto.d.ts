import { PapelUsuario } from '@prisma/client';
import { ProjectAccessDto } from '../../common/dto/project-access.dto';
export declare class UpdateRoleDto {
    papel: PapelUsuario;
    projetos?: ProjectAccessDto[];
}
