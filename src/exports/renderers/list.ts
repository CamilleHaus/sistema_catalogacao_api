/** Tabela pronta para virar arquivo: cabeçalhos e uma linha por obra. */
export interface ListTable {
  headers: string[];
  rows: string[][];
}

const BOM = String.fromCharCode(0xfeff);

/**
 * CSV para o Excel em português: separador `;` (a vírgula é o decimal),
 * BOM para os acentos e quebra de linha CRLF.
 */
export function listToCsv(table: ListTable) {
  const cell = (value: string) =>
    /[";\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  const lines = [table.headers, ...table.rows].map((row) =>
    row.map(cell).join(';'),
  );
  return Buffer.from(`${BOM}${lines.join('\r\n')}\r\n`, 'utf8');
}
