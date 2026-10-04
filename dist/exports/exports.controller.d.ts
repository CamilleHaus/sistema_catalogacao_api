import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import type { AuthenticatedUser } from '../auth/auth.types';
import { ExportDto } from './export.dto';
import { ExportsService } from './exports.service';
export declare class ExportsController {
    private readonly service;
    constructor(service: ExportsService);
    fields(): {
        campos: {
            id: string;
            label: string;
            grupo: string;
        }[];
    };
    export(user: AuthenticatedUser, projetoId: string, dto: ExportDto, res: Response): Promise<StreamableFile>;
}
