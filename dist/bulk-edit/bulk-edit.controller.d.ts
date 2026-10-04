import { BulkEditDto } from './bulk-edit.dto';
import { BulkEditService } from './bulk-edit.service';
export declare class BulkEditController {
    private readonly service;
    constructor(service: BulkEditService);
    fields(projetoId: string): Promise<{
        opcoes?: {
            value: string;
            label: string;
        }[] | undefined;
        id: string;
        label: string;
        grupo: string;
        tipo: import("./bulk-fields").BulkKind;
    }[]>;
    apply(projetoId: string, dto: BulkEditDto): Promise<import("./bulk-edit.service").BulkResult>;
}
