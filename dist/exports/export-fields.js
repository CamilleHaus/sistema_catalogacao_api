"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPORT_FIELDS_BY_ID = exports.EXPORT_FIELDS = void 0;
exports.includeFor = includeFor;
const client_1 = require("@prisma/client");
const search_fields_1 = require("../advanced-search/search-fields");
const DMMF_TYPES = new Map();
function columnType(field) {
    const key = field.id;
    if (DMMF_TYPES.has(key))
        return DMMF_TYPES.get(key);
    let model = 'Obra';
    for (const [relation] of field.hops)
        model = client_1.Prisma.dmmf.datamodel.models
            .find((item) => item.name === model)
            .fields.find((item) => item.name === relation).type;
    const type = client_1.Prisma.dmmf.datamodel.models
        .find((item) => item.name === model)
        .fields.find((item) => item.name === field.column)?.type ?? 'String';
    DMMF_TYPES.set(key, type);
    return type;
}
const number = (digits) => new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits === 2 ? 2 : 0,
    maximumFractionDigits: digits,
});
const MONEY = number(2);
const MEASURE = number(3);
const DATE = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });
function walk(work, hops) {
    let current = [work];
    for (const [relation] of hops)
        current = current.flatMap((item) => {
            const next = item?.[relation];
            if (next === null || next === undefined)
                return [];
            return Array.isArray(next) ? next : [next];
        });
    return current;
}
function plain(raw) {
    return typeof raw === 'string' ||
        typeof raw === 'number' ||
        typeof raw === 'boolean'
        ? String(raw)
        : '';
}
function format(field, raw, ctx) {
    if (raw === null || raw === undefined || raw === '')
        return '';
    if (field.source)
        return ctx.labels[field.source].get(plain(raw)) ?? '';
    if (field.enumOptions)
        return (field.enumOptions.find((option) => option.value === raw)?.label ??
            plain(raw));
    const type = columnType(field);
    if (type === 'Decimal')
        return (field.type === 'valor' ? MONEY : MEASURE).format(Number(raw));
    if (type === 'DateTime')
        return DATE.format(raw);
    return plain(raw);
}
function fromSearchField(field) {
    const base = {
        id: field.id,
        label: field.label,
        group: field.group,
        hops: field.hops,
    };
    if (field.type === 'existe') {
        return {
            ...base,
            read: (work) => {
                const found = field.anyColumn
                    ? field.anyColumn.some((column) => work[column] != null)
                    : walk(work, field.hops).length > 0;
                return found ? 'Sim' : 'Não';
            },
        };
    }
    return {
        ...base,
        read: (work, ctx) => {
            const values = walk(work, field.hops)
                .map((record) => format(field, record[field.column], ctx))
                .filter(Boolean);
            return [...new Set(values)].join('; ');
        },
    };
}
const TIPO_DIMENSAO = {
    SEM_MOLDURA: 'Sem moldura',
    COM_MOLDURA: 'Com moldura',
};
const UNIDADE = { CM: 'cm', IN: 'pol' };
const DIMENSIONS_SUMMARY = {
    id: 'dimensoes',
    label: 'Dimensões',
    group: 'Identificação',
    hops: [['dimensoes', true]],
    read: (work) => (work.dimensoes ?? [])
        .map((dimension) => {
        const measures = [
            dimension.altura,
            dimension.largura,
            dimension.profundidade,
        ]
            .filter((value) => value !== null && value !== undefined)
            .map((value) => MEASURE.format(Number(value)));
        const text = dimension.unidade
            ? `${measures.join(' × ')} ${UNIDADE[dimension.unidade]}`
            : (dimension.descricaoVariavel ?? '');
        return text
            ? `${TIPO_DIMENSAO[dimension.tipo]}: ${text}`
            : '';
    })
        .filter(Boolean)
        .join('; '),
};
const NOT_EXPORTED = new Set([
    'criadoEm',
    'atualizadoEm',
    'artistaLocalNascimento',
    'artistaAnoNascimento',
    'artistaLocalFalecimento',
    'artistaAnoFalecimento',
    'dimensaoTipo',
    'altura',
    'largura',
    'profundidade',
    'unidade',
    'dimensaoVariavel',
    'imagemCreditos',
    'anexoTipo',
]);
exports.EXPORT_FIELDS = search_fields_1.SEARCH_FIELDS.filter((field) => !NOT_EXPORTED.has(field.id) && field.type !== 'existe').flatMap((field) => {
    if (field.id === 'artistas')
        return [];
    if (field.id === 'titulo') {
        const artistas = search_fields_1.SEARCH_FIELDS.find((item) => item.id === 'artistas');
        return [
            fromSearchField(field),
            { ...fromSearchField(artistas), group: 'Identificação' },
        ];
    }
    if (field.id === 'tecnica')
        return [fromSearchField(field), DIMENSIONS_SUMMARY];
    return [fromSearchField(field)];
});
exports.EXPORT_FIELDS_BY_ID = new Map(exports.EXPORT_FIELDS.map((field) => [field.id, field]));
function includeFor(fields) {
    const tree = {};
    for (const field of fields) {
        let node = tree;
        for (const [relation] of field.hops) {
            if (node[relation] === true || node[relation] === undefined)
                node[relation] = { include: {} };
            node = node[relation].include;
        }
    }
    const finish = (node) => Object.fromEntries(Object.entries(node).map(([key, value]) => {
        const children = value.include;
        return [
            key,
            Object.keys(children).length ? { include: finish(children) } : true,
        ];
    }));
    return finish(tree);
}
//# sourceMappingURL=export-fields.js.map