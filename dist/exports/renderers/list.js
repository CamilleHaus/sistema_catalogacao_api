"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listToCsv = listToCsv;
const BOM = String.fromCharCode(0xfeff);
function listToCsv(table) {
    const cell = (value) => /[";\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
    const lines = [table.headers, ...table.rows].map((row) => row.map(cell).join(';'));
    return Buffer.from(`${BOM}${lines.join('\r\n')}\r\n`, 'utf8');
}
//# sourceMappingURL=list.js.map