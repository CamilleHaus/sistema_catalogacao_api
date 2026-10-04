"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BULK_FIELDS_BY_ID = exports.BULK_FIELDS = void 0;
const search_fields_1 = require("../advanced-search/search-fields");
const group = (name, target, defs) => defs.map((def) => ({ ...def, group: name, target }));
exports.BULK_FIELDS = [
    ...group('Identificação', 'obra', [
        { id: 'titulo', label: 'Título', kind: 'texto', column: 'titulo' },
        { id: 'edicao', label: 'Edição', kind: 'texto', column: 'edicao' },
        { id: 'data', label: 'Data da obra', kind: 'texto', column: 'data' },
        {
            id: 'status',
            label: 'Status',
            kind: 'opcao',
            column: 'statusId',
            source: 'status',
        },
        {
            id: 'tecnica',
            label: 'Técnica',
            kind: 'opcao',
            column: 'tecnicaId',
            source: 'tecnicas',
        },
        {
            id: 'localizacao',
            label: 'Localização',
            kind: 'opcao',
            column: 'localizacaoId',
            source: 'localizacoes',
        },
        {
            id: 'fichaMae',
            label: 'Conjunto (ficha mãe)',
            kind: 'opcao',
            column: 'fichaMaeId',
            source: 'fichasMae',
        },
        {
            id: 'quantidadePartes',
            label: 'Quantidade de partes',
            kind: 'inteiro',
            column: 'quantidadePartes',
        },
        {
            id: 'tituloSerie',
            label: 'Título da série',
            kind: 'texto',
            column: 'tituloSerie',
        },
        {
            id: 'artistas',
            label: 'Artistas',
            kind: 'lista',
            column: 'artistaId',
            source: 'artistas',
        },
    ]),
    ...group('Catalogação', 'catalogacao', [
        {
            id: 'categoria',
            label: 'Categoria',
            kind: 'opcao',
            column: 'categoriaId',
            source: 'categorias',
        },
        {
            id: 'tags',
            label: 'Tags',
            kind: 'lista',
            column: 'tagId',
            source: 'tags',
        },
        {
            id: 'proveniencia',
            label: 'Proveniência',
            kind: 'texto',
            column: 'proveniencia',
        },
        {
            id: 'catalogacaoObservacoes',
            label: 'Observações da catalogação',
            kind: 'texto',
            column: 'observacoes',
        },
    ]),
    ...group('Aquisição', 'aquisicao', [
        {
            id: 'aquisicaoForma',
            label: 'Forma de negociação da aquisição',
            kind: 'opcao',
            column: 'formaNegociacaoId',
            source: 'formasNegociacao',
        },
        {
            id: 'aquisicaoData',
            label: 'Data da aquisição',
            kind: 'texto',
            column: 'data',
        },
        {
            id: 'adquiridoDe',
            label: 'Adquirido de',
            kind: 'texto',
            column: 'adquiridoDe',
        },
        {
            id: 'aquisicaoMoeda',
            label: 'Moeda da aquisição',
            kind: 'opcao',
            column: 'moeda',
            enumOptions: search_fields_1.MOEDAS,
        },
    ]),
    ...group('Venda', 'venda', [
        {
            id: 'vendaForma',
            label: 'Forma de negociação da venda',
            kind: 'opcao',
            column: 'formaNegociacaoId',
            source: 'formasNegociacao',
        },
        { id: 'vendaData', label: 'Data da venda', kind: 'texto', column: 'data' },
        {
            id: 'vendidoPara',
            label: 'Vendido para',
            kind: 'texto',
            column: 'vendidoPara',
        },
        {
            id: 'vendaMoeda',
            label: 'Moeda da venda',
            kind: 'opcao',
            column: 'moeda',
            enumOptions: search_fields_1.MOEDAS,
        },
    ]),
];
exports.BULK_FIELDS_BY_ID = new Map(exports.BULK_FIELDS.map((field) => [field.id, field]));
//# sourceMappingURL=bulk-fields.js.map