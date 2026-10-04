export interface ListTable {
    headers: string[];
    rows: string[][];
}
export declare function listToCsv(table: ListTable): Buffer<ArrayBuffer>;
