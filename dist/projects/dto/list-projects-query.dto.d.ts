import { StatusProjeto } from '@prisma/client';
export declare class ListProjectsQueryDto {
    busca?: string;
    status?: StatusProjeto;
}
