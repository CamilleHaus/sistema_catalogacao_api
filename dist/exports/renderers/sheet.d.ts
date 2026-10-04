export interface SheetWork {
    codigo: string;
    titulo: string;
    artistas: string;
    image: {
        data: Buffer;
        width: number;
        height: number;
    } | null;
    ficha: {
        label: string;
        value: string;
    }[];
    sections: SheetSection[];
    gallery: SheetImage[];
}
export interface SheetSection {
    title: string;
    fields: {
        label: string;
        value: string;
    }[];
    images: SheetImage[];
}
export interface SheetImage {
    data: Buffer;
    width: number;
    height: number;
    caption: string | null;
}
export interface SheetDocument {
    title: string;
    context: string;
    generatedAt: string;
    works: SheetWork[];
}
export declare function sheetsToPdf(sheet: SheetDocument): Promise<Buffer>;
