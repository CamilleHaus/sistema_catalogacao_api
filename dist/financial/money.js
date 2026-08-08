"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimal = decimal;
exports.finalValue = finalValue;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
function decimal(value) {
    if (value === null || value === undefined || value === '')
        return null;
    const result = new client_1.Prisma.Decimal(value);
    if (result.isNegative())
        throw new common_1.BadRequestException('Valores negativos não são permitidos.');
    return result;
}
function finalValue(valor, tipo, desconto) {
    if (!valor)
        return null;
    if (!desconto)
        return valor.toDecimalPlaces(2, client_1.Prisma.Decimal.ROUND_HALF_UP);
    if (!tipo)
        throw new common_1.BadRequestException('Informe o tipo de desconto.');
    if (tipo === client_1.TipoDesconto.PERCENTUAL && desconto.greaterThan(100))
        throw new common_1.BadRequestException('O desconto percentual deve estar entre 0 e 100.');
    if (tipo === client_1.TipoDesconto.VALOR_FIXO && desconto.greaterThan(valor))
        throw new common_1.BadRequestException('O desconto fixo não pode superar o valor principal.');
    const result = tipo === client_1.TipoDesconto.VALOR_FIXO
        ? valor.minus(desconto)
        : valor.minus(valor.times(desconto).dividedBy(100));
    return result.toDecimalPlaces(2, client_1.Prisma.Decimal.ROUND_HALF_UP);
}
//# sourceMappingURL=money.js.map