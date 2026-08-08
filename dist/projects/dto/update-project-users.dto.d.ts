import { UserProjectAccessDto } from '../../common/dto/project-access.dto';
export declare class UpdateProjectUsersDto {
    usuarios: UserProjectAccessDto[];
    confirmarDesativacaoUsuarioIds?: string[];
}
