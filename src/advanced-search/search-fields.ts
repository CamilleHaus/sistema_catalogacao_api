import {
  Moeda,
  Prisma,
  TipoArquivoAnexo,
  TipoDesconto,
  TipoDimensao,
  TipoInstrucaoObra,
  UnidadeMedida,
} from '@prisma/client';

/**
 * Catálogo da busca avançada: todo campo pesquisável da obra e de tudo que
 * pende dela. Para um campo novo aparecer no filtro, basta registrá-lo aqui —
 * o front monta a interface a partir de `GET .../busca-avancada/campos`.
 */

export type FieldType =
  'texto' | 'numero' | 'valor' | 'data' | 'opcao' | 'multipla' | 'existe';

/** Cadastros que alimentam as opções dos campos `opcao`/`multipla`. */
export type OptionSource =
  | 'artistas'
  | 'status'
  | 'tecnicas'
  | 'localizacoes'
  | 'fichasMae'
  | 'categorias'
  | 'tags'
  | 'locaisAssinatura'
  | 'estadosConservacao'
  | 'tiposServico'
  | 'formasNegociacao'
  | 'modalidadesSeguro';

/** Relação percorrida a partir da obra: nome no Prisma e se é lista. */
type Hop = [relation: string, many: boolean];

export interface SearchField {
  id: string;
  label: string;
  group: string;
  type: FieldType;
  /** Coluna no último modelo do caminho; ausente em campos `existe`. */
  column?: string;
  hops: Hop[];
  source?: OptionSource;
  enumOptions?: { value: string; label: string }[];
  /** Ids de localização valem também para as sublocalizações. */
  expandTree?: boolean;
  /** Coluna DateTime com hora (criadoEm): "igual" cobre o dia inteiro. */
  timestamp?: boolean;
  /** Campo `existe` satisfeito por qualquer uma destas colunas da obra. */
  anyColumn?: string[];
}

/**
 * O que a busca faz com cada tipo de campo. O front é um formulário, sem
 * escolha de operador: texto busca o trecho; número/valor/data viram faixa
 * "de/até" (inclusiva, uma ponta basta); opções valem se a obra tiver qualquer
 * uma das escolhidas; `existe` é sim/não.
 */
export const OPERATORS: Record<FieldType, string[]> = {
  texto: ['contem'],
  numero: ['minimo', 'maximo', 'entre'],
  valor: ['minimo', 'maximo', 'entre'],
  data: ['minimo', 'maximo', 'entre'],
  opcao: ['em'],
  multipla: ['em'],
  existe: ['sim', 'nao'],
};

function enumOf<T extends string>(labels: Record<T, string>) {
  return (Object.entries(labels) as [T, string][]).map(([value, label]) => ({
    value,
    label,
  }));
}

export const MOEDAS = enumOf<Moeda>({
  BRL: 'Real (BRL)',
  USD: 'Dólar (USD)',
  EUR: 'Euro (EUR)',
  GBP: 'Libra (GBP)',
});
const TIPOS_AJUSTE = enumOf<TipoDesconto>({
  VALOR_FIXO: 'Valor fixo',
  PERCENTUAL: 'Percentual',
});

// Caminhos reaproveitados.
const ARTISTA: Hop[] = [
  ['artistas', true],
  ['artista', false],
];
const DIMENSAO: Hop[] = [['dimensoes', true]];
const CATALOGACAO: Hop[] = [['catalogacao', false]];
const AQUISICAO: Hop[] = [['aquisicao', false]];
const VENDA: Hop[] = [['venda', false]];

type Def = Omit<SearchField, 'hops' | 'group'> & { hops?: Hop[] };

function group(name: string, defs: Def[]): SearchField[] {
  return defs.map((def) => ({ ...def, group: name, hops: def.hops ?? [] }));
}

export const SEARCH_FIELDS: SearchField[] = [
  ...group('Identificação', [
    {
      id: 'codigoAcervo',
      label: 'Código do acervo',
      type: 'texto',
      column: 'codigoAcervo',
    },
    {
      id: 'numeroManual',
      label: 'Número manual',
      type: 'texto',
      column: 'numeroManual',
    },
    { id: 'titulo', label: 'Título', type: 'texto', column: 'titulo' },
    { id: 'edicao', label: 'Edição', type: 'texto', column: 'edicao' },
    { id: 'data', label: 'Data da obra', type: 'texto', column: 'data' },
    {
      id: 'status',
      label: 'Status',
      type: 'opcao',
      column: 'statusId',
      source: 'status',
    },
    {
      id: 'tecnica',
      label: 'Técnica',
      type: 'opcao',
      column: 'tecnicaId',
      source: 'tecnicas',
    },
    {
      id: 'localizacao',
      label: 'Localização atual',
      type: 'opcao',
      column: 'localizacaoId',
      source: 'localizacoes',
      expandTree: true,
    },
    {
      id: 'fichaMae',
      label: 'Conjunto (ficha mãe)',
      type: 'opcao',
      column: 'fichaMaeId',
      source: 'fichasMae',
    },
    {
      id: 'quantidadePartes',
      label: 'Quantidade de partes',
      type: 'numero',
      column: 'quantidadePartes',
    },
    {
      id: 'tituloSerie',
      label: 'Título da série',
      type: 'texto',
      column: 'tituloSerie',
    },
    {
      id: 'temFoto',
      label: 'Tem foto principal',
      type: 'existe',
      // Foto enviada direto ou imagem da galeria marcada como principal.
      anyColumn: ['fotoPrincipalUrl', 'imagemPrincipalId'],
    },
    {
      id: 'criadoEm',
      label: 'Cadastrada em',
      type: 'data',
      column: 'criadoEm',
      timestamp: true,
    },
    {
      id: 'atualizadoEm',
      label: 'Atualizada em',
      type: 'data',
      column: 'atualizadoEm',
      timestamp: true,
    },
  ]),
  ...group('Artista', [
    {
      id: 'artistas',
      label: 'Artista',
      type: 'multipla',
      column: 'artistaId',
      hops: [['artistas', true]],
      source: 'artistas',
    },
    {
      id: 'artistaLocalNascimento',
      label: 'Local de nascimento do artista',
      type: 'texto',
      column: 'localNascimento',
      hops: ARTISTA,
    },
    {
      id: 'artistaAnoNascimento',
      label: 'Ano de nascimento do artista',
      type: 'numero',
      column: 'anoNascimento',
      hops: ARTISTA,
    },
    {
      id: 'artistaLocalFalecimento',
      label: 'Local de falecimento do artista',
      type: 'texto',
      column: 'localFalecimento',
      hops: ARTISTA,
    },
    {
      id: 'artistaAnoFalecimento',
      label: 'Ano de falecimento do artista',
      type: 'numero',
      column: 'anoFalecimento',
      hops: ARTISTA,
    },
  ]),
  ...group('Dimensões', [
    {
      id: 'dimensaoTipo',
      label: 'Tipo de dimensão',
      type: 'opcao',
      column: 'tipo',
      hops: DIMENSAO,
      enumOptions: enumOf<TipoDimensao>({
        SEM_MOLDURA: 'Sem moldura',
        COM_MOLDURA: 'Com moldura',
      }),
    },
    {
      id: 'altura',
      label: 'Altura',
      type: 'numero',
      column: 'altura',
      hops: DIMENSAO,
    },
    {
      id: 'largura',
      label: 'Largura',
      type: 'numero',
      column: 'largura',
      hops: DIMENSAO,
    },
    {
      id: 'profundidade',
      label: 'Profundidade',
      type: 'numero',
      column: 'profundidade',
      hops: DIMENSAO,
    },
    {
      id: 'unidade',
      label: 'Unidade de medida',
      type: 'opcao',
      column: 'unidade',
      hops: DIMENSAO,
      enumOptions: enumOf<UnidadeMedida>({
        CM: 'Centímetros',
        IN: 'Polegadas',
      }),
    },
    {
      id: 'dimensaoVariavel',
      label: 'Dimensão variável',
      type: 'texto',
      column: 'descricaoVariavel',
      hops: DIMENSAO,
    },
  ]),
  ...group('Catalogação', [
    {
      id: 'categoria',
      label: 'Categoria',
      type: 'opcao',
      column: 'categoriaId',
      hops: CATALOGACAO,
      source: 'categorias',
    },
    {
      id: 'tags',
      label: 'Tags',
      type: 'multipla',
      column: 'tagId',
      hops: [...CATALOGACAO, ['tags', true]],
      source: 'tags',
    },
    {
      id: 'proveniencia',
      label: 'Proveniência',
      type: 'texto',
      column: 'proveniencia',
      hops: CATALOGACAO,
    },
    {
      id: 'catalogacaoObservacoes',
      label: 'Observações da catalogação',
      type: 'texto',
      column: 'observacoes',
      hops: CATALOGACAO,
    },
    {
      id: 'localAssinatura',
      label: 'Local da assinatura',
      type: 'multipla',
      column: 'localAssinaturaId',
      hops: [...CATALOGACAO, ['assinaturas', true]],
      source: 'locaisAssinatura',
    },
    {
      id: 'temCertificado',
      label: 'Tem certificado',
      type: 'existe',
      hops: [...CATALOGACAO, ['certificados', true]],
    },
  ]),
  ...group('Mídias', [
    {
      id: 'temImagens',
      label: 'Tem imagens',
      type: 'existe',
      hops: [['imagens', true]],
    },
    {
      id: 'imagemCreditos',
      label: 'Créditos de imagem',
      type: 'texto',
      column: 'creditos',
      hops: [['imagens', true]],
    },
    {
      id: 'temAnexos',
      label: 'Tem anexos',
      type: 'existe',
      hops: [['anexos', true]],
    },
    {
      id: 'anexoTipo',
      label: 'Tipo de anexo',
      type: 'opcao',
      column: 'tipo',
      hops: [['anexos', true]],
      enumOptions: enumOf<TipoArquivoAnexo>({
        IMAGEM: 'Imagem',
        PDF: 'PDF',
        DOCUMENTO: 'Documento',
        PLANILHA: 'Planilha',
        APRESENTACAO: 'Apresentação',
        AUDIO: 'Áudio',
        VIDEO: 'Vídeo',
        OUTRO: 'Outro',
      }),
    },
  ]),
  ...group('Conservação', [
    {
      id: 'estadoConservacao',
      label: 'Estado de conservação',
      type: 'opcao',
      column: 'estadoConservacaoId',
      hops: [['analisesConservacao', true]],
      source: 'estadosConservacao',
    },
    {
      id: 'conservacaoData',
      label: 'Data da análise',
      type: 'data',
      column: 'data',
      hops: [['analisesConservacao', true]],
    },
    {
      id: 'conservacaoAvaliador',
      label: 'Avaliador da conservação',
      type: 'texto',
      column: 'avaliador',
      hops: [['analisesConservacao', true]],
    },
    {
      id: 'conservacaoObservacoes',
      label: 'Observações da conservação',
      type: 'texto',
      column: 'observacoes',
      hops: [['analisesConservacao', true]],
    },
  ]),
  ...group('Restauro e serviços', [
    {
      id: 'temRestauro',
      label: 'Tem restauro',
      type: 'existe',
      hops: [['restauros', true]],
    },
    {
      id: 'restauroLocal',
      label: 'Local do restauro',
      type: 'texto',
      column: 'localRestauro',
      hops: [['restauros', true]],
    },
    {
      id: 'restauroMotivo',
      label: 'Motivo do restauro',
      type: 'texto',
      column: 'motivo',
      hops: [['restauros', true]],
    },
    {
      id: 'restauroEntrada',
      label: 'Entrada no restauro',
      type: 'texto',
      column: 'dataEntrada',
      hops: [['restauros', true]],
    },
    {
      id: 'restauroSaida',
      label: 'Saída do restauro',
      type: 'texto',
      column: 'dataSaida',
      hops: [['restauros', true]],
    },
    {
      id: 'tipoServico',
      label: 'Tipo de serviço',
      type: 'opcao',
      column: 'tipoServicoId',
      hops: [['servicos', true]],
      source: 'tiposServico',
    },
    {
      id: 'servicoLocal',
      label: 'Local do serviço',
      type: 'texto',
      column: 'local',
      hops: [['servicos', true]],
    },
    {
      id: 'servicoData',
      label: 'Data do serviço',
      type: 'texto',
      column: 'data',
      hops: [['servicos', true]],
    },
  ]),
  ...group('Instruções', [
    {
      id: 'instrucaoTipo',
      label: 'Tipo de instrução',
      type: 'opcao',
      column: 'tipo',
      hops: [['instrucoes', true]],
      enumOptions: enumOf<TipoInstrucaoObra>({
        EMBALAGEM: 'Embalagem',
        TRANSPORTE: 'Transporte',
        MANUSEIO: 'Manuseio',
      }),
    },
    {
      id: 'instrucaoProfissional',
      label: 'Profissional responsável',
      type: 'texto',
      column: 'profissionalResponsavel',
      hops: [['instrucoes', true]],
    },
    {
      id: 'instrucaoObservacoes',
      label: 'Observações da instrução',
      type: 'texto',
      column: 'observacoes',
      hops: [['instrucoes', true]],
    },
  ]),
  ...group('Movimentação', [
    {
      id: 'movimentacaoEntrada',
      label: 'Movimentada para',
      type: 'opcao',
      column: 'localEntradaId',
      hops: [['movimentacoes', true]],
      source: 'localizacoes',
      expandTree: true,
    },
    {
      id: 'movimentacaoSaida',
      label: 'Movimentada de',
      type: 'opcao',
      column: 'localSaidaId',
      hops: [['movimentacoes', true]],
      source: 'localizacoes',
      expandTree: true,
    },
    {
      id: 'movimentacaoData',
      label: 'Data da movimentação',
      type: 'texto',
      column: 'data',
      hops: [['movimentacoes', true]],
    },
    {
      id: 'movimentacaoResponsavel',
      label: 'Movimentação realizada por',
      type: 'texto',
      column: 'realizadoPor',
      hops: [['movimentacoes', true]],
    },
  ]),
  ...group('Pesquisa', [
    {
      id: 'exposicao',
      label: 'Exposição',
      type: 'texto',
      column: 'nomeExposicao',
      hops: [['curriculos', true]],
    },
    {
      id: 'exposicaoInstituicao',
      label: 'Instituição da exposição',
      type: 'texto',
      column: 'instituicao',
      hops: [['curriculos', true]],
    },
    {
      id: 'exposicaoCidade',
      label: 'Cidade da exposição',
      type: 'texto',
      column: 'cidade',
      hops: [['curriculos', true]],
    },
    {
      id: 'exposicaoPais',
      label: 'País da exposição',
      type: 'texto',
      column: 'pais',
      hops: [['curriculos', true]],
    },
    {
      id: 'exposicaoData',
      label: 'Data da exposição',
      type: 'texto',
      column: 'data',
      hops: [['curriculos', true]],
    },
    {
      id: 'publicacaoTitulo',
      label: 'Título da publicação',
      type: 'texto',
      column: 'titulo',
      hops: [['publicacoes', true]],
    },
    {
      id: 'publicacaoAutor',
      label: 'Autor da publicação',
      type: 'texto',
      column: 'autor',
      hops: [['publicacoes', true]],
    },
    {
      id: 'publicacaoEditora',
      label: 'Editora',
      type: 'texto',
      column: 'editora',
      hops: [['publicacoes', true]],
    },
    {
      id: 'publicacaoAno',
      label: 'Ano da publicação',
      type: 'numero',
      column: 'ano',
      hops: [['publicacoes', true]],
    },
    {
      id: 'pesquisaTitulo',
      label: 'Título da pesquisa museológica',
      type: 'texto',
      column: 'titulo',
      hops: [['pesquisasMuseologicas', true]],
    },
    {
      id: 'pesquisaDescricao',
      label: 'Descrição da pesquisa museológica',
      type: 'texto',
      column: 'descricao',
      hops: [['pesquisasMuseologicas', true]],
    },
  ]),
  ...group('Aquisição', [
    {
      id: 'temAquisicao',
      label: 'Tem aquisição',
      type: 'existe',
      hops: AQUISICAO,
    },
    {
      id: 'aquisicaoForma',
      label: 'Forma de negociação da aquisição',
      type: 'opcao',
      column: 'formaNegociacaoId',
      hops: AQUISICAO,
      source: 'formasNegociacao',
    },
    {
      id: 'aquisicaoData',
      label: 'Data da aquisição',
      type: 'texto',
      column: 'data',
      hops: AQUISICAO,
    },
    {
      id: 'adquiridoDe',
      label: 'Adquirido de',
      type: 'texto',
      column: 'adquiridoDe',
      hops: AQUISICAO,
    },
    {
      id: 'aquisicaoMoeda',
      label: 'Moeda da aquisição',
      type: 'opcao',
      column: 'moeda',
      hops: AQUISICAO,
      enumOptions: MOEDAS,
    },
    {
      id: 'aquisicaoValor',
      label: 'Valor da aquisição',
      type: 'valor',
      column: 'valor',
      hops: AQUISICAO,
    },
    {
      id: 'aquisicaoTipoDesconto',
      label: 'Tipo de desconto da aquisição',
      type: 'opcao',
      column: 'tipoDesconto',
      hops: AQUISICAO,
      enumOptions: TIPOS_AJUSTE,
    },
    {
      id: 'aquisicaoDesconto',
      label: 'Desconto da aquisição',
      type: 'valor',
      column: 'desconto',
      hops: AQUISICAO,
    },
    {
      id: 'aquisicaoValorFinal',
      label: 'Valor final da aquisição',
      type: 'valor',
      column: 'valorFinal',
      hops: AQUISICAO,
    },
    {
      id: 'aquisicaoTipoComissao',
      label: 'Tipo de comissão',
      type: 'opcao',
      column: 'tipoComissao',
      hops: AQUISICAO,
      enumOptions: TIPOS_AJUSTE,
    },
    {
      id: 'aquisicaoComissao',
      label: 'Comissão',
      type: 'valor',
      column: 'comissao',
      hops: AQUISICAO,
    },
    {
      id: 'aquisicaoValorComissao',
      label: 'Valor da comissão',
      type: 'valor',
      column: 'valorComissao',
      hops: AQUISICAO,
    },
    {
      id: 'notaFiscalNumero',
      label: 'Número da nota fiscal',
      type: 'texto',
      column: 'numero',
      hops: [...AQUISICAO, ['notasFiscais', true]],
    },
    {
      id: 'notaFiscalData',
      label: 'Data da nota fiscal',
      type: 'data',
      column: 'data',
      hops: [...AQUISICAO, ['notasFiscais', true]],
    },
    {
      id: 'notaFiscalValor',
      label: 'Valor da nota fiscal',
      type: 'valor',
      column: 'valor',
      hops: [...AQUISICAO, ['notasFiscais', true]],
    },
    {
      id: 'pagamentoData',
      label: 'Data do pagamento',
      type: 'data',
      column: 'data',
      hops: [...AQUISICAO, ['comprovantes', true]],
    },
    {
      id: 'pagamentoValor',
      label: 'Valor do pagamento',
      type: 'valor',
      column: 'valor',
      hops: [...AQUISICAO, ['comprovantes', true]],
    },
  ]),
  ...group('Venda', [
    { id: 'temVenda', label: 'Tem venda', type: 'existe', hops: VENDA },
    {
      id: 'vendaForma',
      label: 'Forma de negociação da venda',
      type: 'opcao',
      column: 'formaNegociacaoId',
      hops: VENDA,
      source: 'formasNegociacao',
    },
    {
      id: 'vendaData',
      label: 'Data da venda',
      type: 'texto',
      column: 'data',
      hops: VENDA,
    },
    {
      id: 'vendidoPara',
      label: 'Vendido para',
      type: 'texto',
      column: 'vendidoPara',
      hops: VENDA,
    },
    {
      id: 'vendaMoeda',
      label: 'Moeda da venda',
      type: 'opcao',
      column: 'moeda',
      hops: VENDA,
      enumOptions: MOEDAS,
    },
    {
      id: 'vendaValor',
      label: 'Valor da venda',
      type: 'valor',
      column: 'valor',
      hops: VENDA,
    },
    {
      id: 'vendaTipoDesconto',
      label: 'Tipo de desconto da venda',
      type: 'opcao',
      column: 'tipoDesconto',
      hops: VENDA,
      enumOptions: TIPOS_AJUSTE,
    },
    {
      id: 'vendaDesconto',
      label: 'Desconto da venda',
      type: 'valor',
      column: 'desconto',
      hops: VENDA,
    },
    {
      id: 'vendaValorFinal',
      label: 'Valor final da venda',
      type: 'valor',
      column: 'valorFinal',
      hops: VENDA,
    },
    {
      id: 'comprovanteVendaData',
      label: 'Data do comprovante de venda',
      type: 'data',
      column: 'data',
      hops: [...VENDA, ['comprovantes', true]],
    },
    {
      id: 'comprovanteVendaValor',
      label: 'Valor do comprovante de venda',
      type: 'valor',
      column: 'valor',
      hops: [...VENDA, ['comprovantes', true]],
    },
  ]),
  ...group('Avaliação e seguro', [
    {
      id: 'temAvaliacao',
      label: 'Tem avaliação',
      type: 'existe',
      hops: [['avaliacoes', true]],
    },
    {
      id: 'avaliacaoData',
      label: 'Data da avaliação',
      type: 'data',
      column: 'data',
      hops: [['avaliacoes', true]],
    },
    {
      id: 'avaliacaoMoeda',
      label: 'Moeda da avaliação',
      type: 'opcao',
      column: 'moeda',
      hops: [['avaliacoes', true]],
      enumOptions: MOEDAS,
    },
    {
      id: 'avaliacaoValor',
      label: 'Valor da avaliação',
      type: 'valor',
      column: 'valor',
      hops: [['avaliacoes', true]],
    },
    {
      id: 'avaliador',
      label: 'Avaliador',
      type: 'texto',
      column: 'avaliador',
      hops: [['avaliacoes', true]],
    },
    {
      id: 'temSeguro',
      label: 'Tem seguro',
      type: 'existe',
      hops: [['seguros', true]],
    },
    {
      id: 'seguroModalidade',
      label: 'Modalidade de seguro',
      type: 'opcao',
      column: 'modalidadeSeguroId',
      hops: [['seguros', true]],
      source: 'modalidadesSeguro',
    },
    {
      id: 'seguroVigencia',
      label: 'Vigência do seguro',
      type: 'texto',
      column: 'vigencia',
      hops: [['seguros', true]],
    },
    {
      id: 'seguroMoeda',
      label: 'Moeda do seguro',
      type: 'opcao',
      column: 'moeda',
      hops: [['seguros', true]],
      enumOptions: MOEDAS,
    },
    {
      id: 'seguroValor',
      label: 'Valor do seguro',
      type: 'valor',
      column: 'valor',
      hops: [['seguros', true]],
    },
  ]),
];

export const FIELDS_BY_ID = new Map(
  SEARCH_FIELDS.map((field) => [field.id, field]),
);

/** Condição já validada, com o valor no formato que o Prisma espera. */
export interface ResolvedCondition {
  field: SearchField;
  operator: string;
  /** string (texto/número/data), [de, até] (entre) ou lista de ids/enums. */
  value?: string | [string, string] | string[];
}

type Where = Record<string, unknown>;

/** Envolve o filtro da coluna no caminho de relações até a obra. */
function wrap(field: SearchField, inner: Where): Prisma.ObraWhereInput {
  return field.hops.reduceRight<Where>(
    (acc, [relation, many]) => ({
      [relation]: many ? { some: acc } : { is: acc },
    }),
    inner,
  );
}

/**
 * Tipo da coluna, lido do schema do Prisma seguindo o caminho a partir da obra.
 * Calculado ao carregar o módulo: caminho ou coluna errada no catálogo derruba a
 * API na subida, em vez de virar erro na primeira busca.
 */
function columnType(field: SearchField) {
  let model = 'Obra';
  for (const [relation] of field.hops) {
    const hop = Prisma.dmmf.datamodel.models
      .find((item) => item.name === model)
      ?.fields.find((item) => item.name === relation);
    if (!hop) throw new Error(`Relação inexistente: ${model}.${relation}`);
    model = hop.type;
  }
  const column = Prisma.dmmf.datamodel.models
    .find((item) => item.name === model)
    ?.fields.find((item) => item.name === field.column);
  if (!column) throw new Error(`Coluna inexistente: ${model}.${field.column}`);
  return column.type;
}

const COLUMN_TYPE = new Map(
  SEARCH_FIELDS.filter((field) => field.column).map((field) => [
    field.id,
    columnType(field),
  ]),
);

function scalar(field: SearchField, raw: string): unknown {
  if (field.type === 'data') return new Date(`${raw}T00:00:00.000Z`);
  // Colunas Int recebem número; Decimal aceita a string sem perder precisão.
  return COLUMN_TYPE.get(field.id) === 'Int' ? Number(raw) : raw;
}

function nextDay(raw: string) {
  const date = new Date(`${raw}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date;
}

/** Limite inferior inclusivo ("de"). */
function lower(field: SearchField, raw: string) {
  return { gte: scalar(field, raw) };
}

/** Limite superior inclusivo ("até"); em data com hora, vale o dia inteiro. */
function upper(field: SearchField, raw: string) {
  return field.timestamp ? { lt: nextDay(raw) } : { lte: scalar(field, raw) };
}

export function buildCondition({
  field,
  operator,
  value,
}: ResolvedCondition): Prisma.ObraWhereInput {
  const column = field.column!;

  if (field.type === 'existe') {
    const positive: Prisma.ObraWhereInput = field.anyColumn
      ? {
          OR: field.anyColumn.map((name) => ({ [name]: { not: null } })),
        }
      : wrapExists(field);
    return operator === 'sim' ? positive : { NOT: positive };
  }

  switch (operator) {
    case 'contem':
      return wrap(field, {
        [column]: { contains: value, mode: 'insensitive' },
      });
    case 'minimo':
      return wrap(field, { [column]: lower(field, value as string) });
    case 'maximo':
      return wrap(field, { [column]: upper(field, value as string) });
    case 'entre': {
      const [from, to] = value as [string, string];
      return wrap(field, {
        [column]: { ...lower(field, from), ...upper(field, to) },
      });
    }
    case 'em':
      return wrap(field, { [column]: { in: value } });
  }
  throw new Error(`Operador sem tradução: ${operator}`);
}

/** Existência pelo caminho: listas viram `some: {}`, relações únicas `isNot: null`. */
function wrapExists(field: SearchField): Prisma.ObraWhereInput {
  const [last, ...rest] = [...field.hops].reverse();
  const inner: Where = last[1]
    ? { [last[0]]: { some: {} } }
    : { [last[0]]: { isNot: null } };
  return rest.reduce<Where>(
    (acc, [relation, many]) => ({
      [relation]: many ? { some: acc } : { is: acc },
    }),
    inner,
  );
}
