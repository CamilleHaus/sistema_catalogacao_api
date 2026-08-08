import { UpdateWorkPhotoDto } from './dto/update-work-photo.dto';
import { WorkPhotosService } from './work-photos.service';
export declare class WorkPhotosController {
    private readonly service;
    constructor(service: WorkPhotosService);
    update(projetoId: string, obraId: string, dto: UpdateWorkPhotoDto): Promise<{
        id: string;
        atualizadoEm: Date;
        fotoPrincipalUrl: string | null;
    }>;
    remove(projetoId: string, obraId: string): Promise<{
        id: string;
        atualizadoEm: Date;
        fotoPrincipalUrl: string | null;
    }>;
}
