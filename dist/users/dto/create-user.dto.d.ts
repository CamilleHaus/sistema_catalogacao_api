import { PapelUsuario } from '@prisma/client';
import { ProjectAccessDto } from '../../common/dto/project-access.dto';
export declare class CreateUserDto {
    nome: string;
    email: string;
    papel: PapelUsuario;
    senhaTemporaria: string;
    projetos?: ProjectAccessDto[];
}
