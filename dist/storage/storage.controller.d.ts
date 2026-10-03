import { StorageService } from './storage.service';
export declare class StorageController {
    private readonly service;
    constructor(service: StorageService);
    upload(projetoId: string, file?: Express.Multer.File): Promise<{
        key: string;
        url: string;
        tamanho: number;
        tipo: string;
        nomeOriginal: string;
    }>;
}
