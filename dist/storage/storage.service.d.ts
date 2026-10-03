import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../config/app.config';
export declare const ACCEPTED_MIME_TYPES: string[];
export declare class StorageService {
    private readonly config;
    private readonly logger;
    private readonly client;
    private readonly bucket;
    private readonly publicUrl;
    constructor(config: ConfigService<AppConfig, true>);
    upload(file: Express.Multer.File, prefix: string): Promise<{
        key: string;
        url: string;
        tamanho: number;
        tipo: string;
        nomeOriginal: string;
    }>;
    removeByUrl(url: string): Promise<boolean>;
    private keyFromUrl;
    private extensionFor;
}
