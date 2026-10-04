import { Prisma } from '@prisma/client';
import type { OptionSource } from '../advanced-search/search-fields';
import {
  SEARCH_FIELDS,
  type SearchField,
} from '../advanced-search/search-fields';

/**
 * Campos exportáveis. Reaproveita o catálogo da busca avançada — mesmo id,
 * rótulo, grupo e caminho de relações —, então campo novo registrado lá já
 * aparece aqui. Só as dimensões ganham um campo-resumo próprio, porque altura,
 * largura e profundidade soltas não dizem a qual dimensão pertencem.
 */
export interface ExportField {
  id: string;
  label: string;
  group: string;
  /** Relações a carregar para ler o campo (vazio = coluna da própria obra). */
  hops: SearchField['hops'];
  read: (work: Row, ctx: ExportContext) => string;
}

// A obra vem com um `include` montado a partir dos campos escolhidos; o
// formato exato varia, por isso a leitura é dinâmica.

export type Row = Record<string, any>;

export interface ExportContext {
  /** Rótulo de cada opção (status, técnica, tags…) pelo id. */
  labels: Record<OptionSource, Map<string, string>>;
}

const DMMF_TYPES = new Map<string, string>();
function columnType(field: SearchField) {
  const key = field.id;
  if (DMMF_TYPES.has(key)) return DMMF_TYPES.get(key)!;
  let model = 'Obra';
  for (const [relation] of field.hops)
    model = Prisma.dmmf.datamodel.models
      .find((item) => item.name === model)!
      .fields.find((item) => item.name === relation)!.type;
  const type =
    Prisma.dmmf.datamodel.models
      .find((item) => item.name === model)!
      .fields.find((item) => item.name === field.column)?.type ?? 'String';
  DMMF_TYPES.set(key, type);
  return type;
}

const number = (digits: number) =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits === 2 ? 2 : 0,
    maximumFractionDigits: digits,
  });
const MONEY = number(2);
const MEASURE = number(3);
const DATE = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });

/** Percorre o caminho e devolve os registros do fim (lista achatada). */
function walk(work: Row, hops: SearchField['hops']): Row[] {
  let current: Row[] = [work];
  for (const [relation] of hops)
    current = current.flatMap<Row>((item) => {
      const next = item?.[relation] as Row | Row[] | null | undefined;
      if (next === null || next === undefined) return [];
      // isArray estreita para any[]; o cast mantém o tipo das linhas.
      return Array.isArray(next) ? (next as Row[]) : [next];
    });
  return current;
}

/** Texto de um valor simples (id, enum, número, texto) vindo do banco. */
function plain(raw: unknown) {
  return typeof raw === 'string' ||
    typeof raw === 'number' ||
    typeof raw === 'boolean'
    ? String(raw)
    : '';
}

function format(field: SearchField, raw: unknown, ctx: ExportContext): string {
  if (raw === null || raw === undefined || raw === '') return '';
  if (field.source) return ctx.labels[field.source].get(plain(raw)) ?? '';
  if (field.enumOptions)
    return (
      field.enumOptions.find((option) => option.value === raw)?.label ??
      plain(raw)
    );
  const type = columnType(field);
  if (type === 'Decimal')
    return (field.type === 'valor' ? MONEY : MEASURE).format(Number(raw));
  if (type === 'DateTime') return DATE.format(raw as Date);
  return plain(raw);
}

function fromSearchField(field: SearchField): ExportField {
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
        .map((record) => format(field, record[field.column!], ctx))
        .filter(Boolean);
      // Em listas (várias exposições, várias análises…) junta sem repetir.
      return [...new Set(values)].join('; ');
    },
  };
}

const TIPO_DIMENSAO: Record<string, string> = {
  SEM_MOLDURA: 'Sem moldura',
  COM_MOLDURA: 'Com moldura',
};
const UNIDADE: Record<string, string> = { CM: 'cm', IN: 'pol' };

const DIMENSIONS_SUMMARY: ExportField = {
  id: 'dimensoes',
  label: 'Dimensões',
  group: 'Identificação',
  hops: [['dimensoes', true]],
  read: (work) =>
    ((work.dimensoes as Row[] | undefined) ?? [])
      .map((dimension) => {
        const measures = [
          dimension.altura,
          dimension.largura,
          dimension.profundidade,
        ]
          .filter((value) => value !== null && value !== undefined)
          .map((value) => MEASURE.format(Number(value)));
        const text = dimension.unidade
          ? `${measures.join(' × ')} ${UNIDADE[dimension.unidade as string]}`
          : ((dimension.descricaoVariavel as string | null) ?? '');
        return text
          ? `${TIPO_DIMENSAO[dimension.tipo as string]}: ${text}`
          : '';
      })
      .filter(Boolean)
      .join('; '),
};

/**
 * Campos da busca que não fazem sentido numa exportação: datas de controle,
 * dados biográficos do artista e as
 * medidas soltas — o resumo "Dimensões" já diz tudo isso de forma legível.
 */
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
  // Mídias: as imagens já vão na folha; créditos e tipo de anexo não ajudam.
  'imagemCreditos',
  'anexoTipo',
]);

export const EXPORT_FIELDS: ExportField[] = SEARCH_FIELDS.filter(
  // Os "Tem…" (sim/não) servem para filtrar, não para exportar: o conteúdo
  // em si (certificado, imagens, aquisição…) já vai na folha.
  (field) => !NOT_EXPORTED.has(field.id) && field.type !== 'existe',
).flatMap((field): ExportField[] => {
  // Artista e o resumo das dimensões ficariam sozinhos nos grupos deles;
  // entram na Identificação, ao lado do título e da técnica.
  if (field.id === 'artistas') return [];
  if (field.id === 'titulo') {
    const artistas = SEARCH_FIELDS.find((item) => item.id === 'artistas')!;
    return [
      fromSearchField(field),
      { ...fromSearchField(artistas), group: 'Identificação' },
    ];
  }
  if (field.id === 'tecnica')
    return [fromSearchField(field), DIMENSIONS_SUMMARY];
  return [fromSearchField(field)];
});

export const EXPORT_FIELDS_BY_ID = new Map(
  EXPORT_FIELDS.map((field) => [field.id, field]),
);

/** `include` do Prisma que carrega tudo que os campos escolhidos leem. */
export function includeFor(fields: ExportField[]) {
  const tree: Row = {};
  for (const field of fields) {
    let node = tree;
    for (const [relation] of field.hops) {
      if (node[relation] === true || node[relation] === undefined)
        node[relation] = { include: {} };
      node = (node[relation] as Row).include as Row;
    }
  }
  // Folhas sem sub-relações viram `true`, que é o que o Prisma espera.
  const finish = (node: Row): Row =>
    Object.fromEntries(
      Object.entries(node).map(([key, value]) => {
        const children = (value as Row).include as Row;
        return [
          key,
          Object.keys(children).length ? { include: finish(children) } : true,
        ];
      }),
    );
  return finish(tree) as Prisma.ObraInclude;
}
