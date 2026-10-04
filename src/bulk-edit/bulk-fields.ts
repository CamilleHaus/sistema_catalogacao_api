import { MOEDAS, type OptionSource } from '../advanced-search/search-fields';

/**
 * Campos que a edição em massa altera — um por vez, em todas as obras
 * escolhidas. Só entram campos que a obra tem uma única vez (dela, da
 * catalogação, da aquisição e da venda); registros em lista (dimensões,
 * análises, movimentações…) não têm "o" valor a definir.
 */
export type BulkKind = 'texto' | 'inteiro' | 'opcao' | 'lista';
export type BulkTarget = 'obra' | 'catalogacao' | 'aquisicao' | 'venda';

export interface BulkField {
  id: string;
  label: string;
  group: string;
  kind: BulkKind;
  target: BulkTarget;
  column: string;
  source?: OptionSource;
  enumOptions?: { value: string; label: string }[];
}

type Def = Omit<BulkField, 'group' | 'target'>;
const group = (name: string, target: BulkTarget, defs: Def[]): BulkField[] =>
  defs.map((def) => ({ ...def, group: name, target }));

export const BULK_FIELDS: BulkField[] = [
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
      enumOptions: MOEDAS,
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
      enumOptions: MOEDAS,
    },
  ]),
];

export const BULK_FIELDS_BY_ID = new Map(
  BULK_FIELDS.map((field) => [field.id, field]),
);
