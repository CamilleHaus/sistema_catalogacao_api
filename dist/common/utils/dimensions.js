"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDimensionInput = validateDimensionInput;
const common_1 = require("@nestjs/common");
function validateDimensionInput(dto) {
    const hasDescription = Boolean(dto.descricaoVariavel?.trim());
    const hasAnyNumber = dto.altura !== undefined ||
        dto.largura !== undefined ||
        dto.profundidade !== undefined ||
        dto.unidade !== undefined;
    if (hasDescription && hasAnyNumber)
        throw new common_1.BadRequestException('Use medidas numéricas ou descrição variável, nunca ambas.');
    if (hasDescription)
        return {
            altura: null,
            largura: null,
            profundidade: null,
            unidade: null,
            descricaoVariavel: dto.descricaoVariavel.trim(),
        };
    if (dto.altura === undefined ||
        dto.largura === undefined ||
        dto.unidade === undefined)
        throw new common_1.BadRequestException('Altura, largura e unidade são obrigatórias na dimensão numérica.');
    return {
        altura: dto.altura,
        largura: dto.largura,
        profundidade: dto.profundidade ?? null,
        unidade: dto.unidade,
        descricaoVariavel: null,
    };
}
//# sourceMappingURL=dimensions.js.map