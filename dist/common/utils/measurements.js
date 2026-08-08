"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMeasurement = convertMeasurement;
exports.presentDimension = presentDimension;
const client_1 = require("@prisma/client");
const INCH_IN_CM = 2.54;
function convertMeasurement(value, from) {
    const converted = from === client_1.UnidadeMedida.IN ? value * INCH_IN_CM : value / INCH_IN_CM;
    return {
        valor: Math.round((converted + Number.EPSILON) * 100) / 100,
        unidade: from === client_1.UnidadeMedida.IN ? client_1.UnidadeMedida.CM : client_1.UnidadeMedida.IN,
    };
}
function presentDimension(dimension) {
    if (!dimension.unidade)
        return { ...dimension, formato: 'VARIAVEL' };
    const altura = dimension.altura.toNumber();
    const largura = dimension.largura.toNumber();
    const profundidade = dimension.profundidade?.toNumber() ?? null;
    return {
        ...dimension,
        formato: 'NUMERICA',
        altura,
        largura,
        profundidade,
        conversao: {
            altura: convertMeasurement(altura, dimension.unidade),
            largura: convertMeasurement(largura, dimension.unidade),
            profundidade: profundidade === null
                ? null
                : convertMeasurement(profundidade, dimension.unidade),
        },
    };
}
//# sourceMappingURL=measurements.js.map