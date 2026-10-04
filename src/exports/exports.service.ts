import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdvancedSearchService } from '../advanced-search/advanced-search.service';
import type { SearchConditionDto } from '../advanced-search/advanced-search.dto';
import type { OptionSource } from '../advanced-search/search-fields';
import { PrismaService } from '../database/prisma.service';
import type { ExportDto, ExportScopeDto } from './export.dto';
import {
  EXPORT_FIELDS,
  EXPORT_FIELDS_BY_ID,
  includeFor,
  type ExportContext,
} from './export-fields';
import sharp from 'sharp';
import { StorageService } from '../storage/storage.service';
import { listToCsv } from './renderers/list';
import {
  sheetsToPdf,
  type SheetImage,
  type SheetWork,
} from './renderers/sheet';

/**
 * Campos que vão na ficha técnica, ao lado da imagem, nesta ordem — os mesmos
 * da ficha na página da obra. Código, título e artista ficam fora porque já
 * estão no topo da folha.
 */
const FICHA_FIELDS = [
  'numeroManual',
  'data',
  'edicao',
  'tecnica',
  'dimensoes',
  'status',
  'localizacao',
  'fichaMae',
  'quantidadePartes',
  'tituloSerie',
];
const IN_HEADER = new Set(['codigoAcervo', 'titulo', 'artistas']);
type ImageRef = { url: string; caption: string | null };
const INSTRUCTION_LABEL: Record<string, string> = {
  EMBALAGEM: 'Embalagem',
  TRANSPORTE: 'Transporte',
  MANUSEIO: 'Manuseio',
};
const DATE = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });
/** Imagens são baixadas e reduzidas em lotes, para não estourar memória. */
const IMAGE_BATCH = 4;

export interface ExportFile {
  filename: string;
  contentType: string;
  body: Buffer;
}

@Injectable()
export class ExportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly search: AdvancedSearchService,
    private readonly storage: StorageService,
  ) {}

  /** Campos que a pessoa pode escolher, na ordem e nos grupos da busca. */
  fields() {
    return {
      campos: EXPORT_FIELDS.map((field) => ({
        id: field.id,
        label: field.label,
        grupo: field.group,
      })),
    };
  }

  async export(
    projetoId: string,
    usuarioId: string,
    dto: ExportDto,
  ): Promise<ExportFile> {
    const fields = [...new Set(dto.campos)].map((id) => {
      const field = EXPORT_FIELDS_BY_ID.get(id);
      if (!field)
        throw new BadRequestException(
          `O campo "${id}" não pode ser exportado.`,
        );
      return field;
    });
    // A ordem das colunas segue o catálogo, não a ordem dos cliques.
    fields.sort((a, b) => EXPORT_FIELDS.indexOf(a) - EXPORT_FIELDS.indexOf(b));

    const project = await this.prisma.projeto.findUnique({
      where: { id: projetoId },
      select: { nome: true, cliente: { select: { nome: true } } },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado.');

    const ids = await this.resolveScope(projetoId, usuarioId, dto.escopo);
    const works = await this.prisma.obra.findMany({
      where: { projetoId, ...(ids ? { id: { in: ids } } : {}) },
      include: {
        ...includeFor(fields),
        // O topo da folha e a imagem precisam disto, escolhido ou não.
        ...(dto.saida === 'pdf'
          ? {
              artistas: { include: { artista: true } },
              imagemPrincipal: { select: { imagemUrl: true } },
            }
          : {}),
      },
      orderBy: { codigoAcervo: 'asc' },
    });
    const ctx = await this.context(projetoId);

    const date = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    }).format(new Date());
    // Data de Brasília no nome do arquivo (en-CA dá o formato AAAA-MM-DD).
    const stamp = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
    }).format(new Date());
    const count = `${works.length} ${works.length === 1 ? 'obra' : 'obras'}`;

    if (dto.saida === 'csv') {
      const csv = listToCsv({
        headers: fields.map((field) => field.label),
        rows: works.map((work) => fields.map((field) => field.read(work, ctx))),
      });
      return {
        filename: `lista-${slug(project.nome)}-${stamp}.csv`,
        contentType: 'text/csv; charset=utf-8',
        body: csv,
      };
    }

    const ficha = FICHA_FIELDS.map((id) =>
      fields.find((field) => field.id === id),
    ).filter((field) => field !== undefined);
    const others = fields.filter(
      (field) => !FICHA_FIELDS.includes(field.id) && !IN_HEADER.has(field.id),
    );
    // Seções na ordem do catálogo; só entram as que têm campo escolhido.
    const sectionNames = [...new Set(others.map((field) => field.group))];
    const recordImages =
      dto.imagens === false
        ? new Map<string, Map<string, ImageRef[]>>()
        : await this.recordImages(works.map((work) => work.id));
    const galleries =
      dto.imagens === false
        ? new Map<string, ImageRef[]>()
        : await this.galleries(works.map((work) => work.id));
    const sheets: SheetWork[] = [];
    for (let start = 0; start < works.length; start += IMAGE_BATCH) {
      const batch = works.slice(start, start + IMAGE_BATCH);
      sheets.push(
        ...(await Promise.all(
          batch.map(async (work) => {
            const mainUrl =
              (work as { imagemPrincipal?: { imagemUrl: string } | null })
                .imagemPrincipal?.imagemUrl ?? work.fotoPrincipalUrl;
            return {
              codigo: work.codigoAcervo,
              titulo: displayTitle(work),
              artistas: (
                work.artistas as unknown as { artista: { nome: string } }[]
              )
                .map(({ artista }) => artista.nome)
                .join(', '),
              image: await this.image(mainUrl),
              ficha: ficha.map((field) => ({
                label: field.label,
                value: field.read(work, ctx),
              })),
              sections: await Promise.all(
                sectionNames.map(async (title) => ({
                  title,
                  fields: others
                    .filter((field) => field.group === title)
                    .map((field) => ({
                      label: field.label,
                      value: field.read(work, ctx),
                    })),
                  images: await this.convertImages(
                    recordImages.get(work.id)?.get(title) ?? [],
                    600,
                  ),
                })),
              ),
              gallery: await this.convertImages(
                // A principal já está no topo da folha.
                (galleries.get(work.id) ?? []).filter(
                  (item) => item.url !== mainUrl,
                ),
              ),
            };
          }),
        )),
      );
    }
    const pdf = await sheetsToPdf({
      title: `Obras — ${project.nome}`,
      context: `${project.nome} · ${project.cliente.nome} · ${count}`,
      generatedAt: date,
      works: sheets,
    });
    return {
      filename: `fichas-${slug(project.nome)}-${stamp}.pdf`,
      contentType: 'application/pdf',
      body: pdf,
    };
  }

  /**
   * Demais imagens de cada obra, na ordem da aba Mídias (mais antiga
   * primeiro): galeria e, depois, fotos das assinaturas.
   */
  private async galleries(obraIds: string[]) {
    const images = await this.prisma.imagemObra.findMany({
      where: { obraId: { in: obraIds } },
      orderBy: { criadoEm: 'asc' },
      select: { obraId: true, imagemUrl: true, creditos: true },
    });
    const result = new Map<string, ImageRef[]>();
    for (const image of images)
      result.set(image.obraId, [
        ...(result.get(image.obraId) ?? []),
        { url: image.imagemUrl, caption: image.creditos?.trim() || null },
      ]);
    return result;
  }

  /**
   * Imagens dos registros de cada seção — o que tem imagem em cada cadastro
   * da obra —, por obra e pelo nome da seção (o grupo do campo).
   */
  private async recordImages(obraIds: string[]) {
    const inWorks = { in: obraIds };
    const asc = { criadoEm: 'asc' as const };
    const day = (date: Date | null) => (date ? DATE.format(date) : '');
    const [
      certificados,
      assinaturas,
      analises,
      instrucoes,
      publicacoes,
      notas,
      pagamentos,
      vendas,
    ] = await Promise.all([
      this.prisma.certificado.findMany({
        where: { catalogacao: { obraId: inWorks } },
        orderBy: asc,
        select: { imagemUrl: true, catalogacao: { select: { obraId: true } } },
      }),
      this.prisma.assinatura.findMany({
        where: { catalogacao: { obraId: inWorks }, imagemUrl: { not: null } },
        orderBy: asc,
        select: {
          imagemUrl: true,
          localAssinatura: { select: { nome: true } },
          catalogacao: { select: { obraId: true } },
        },
      }),
      this.prisma.imagemAnaliseConservacao.findMany({
        where: { analise: { obraId: inWorks } },
        orderBy: asc,
        select: {
          imagemUrl: true,
          creditos: true,
          analise: { select: { obraId: true, data: true } },
        },
      }),
      this.prisma.imagemInstrucaoObra.findMany({
        where: { instrucao: { obraId: inWorks } },
        orderBy: asc,
        select: {
          imagemUrl: true,
          instrucao: { select: { obraId: true, tipo: true } },
        },
      }),
      this.prisma.imagemPublicacao.findMany({
        where: { publicacao: { obraId: inWorks } },
        orderBy: asc,
        select: {
          imagemUrl: true,
          publicacao: { select: { obraId: true, titulo: true } },
        },
      }),
      this.prisma.notaFiscalAquisicao.findMany({
        where: { aquisicao: { obraId: inWorks }, imagemUrl: { not: null } },
        orderBy: asc,
        select: {
          imagemUrl: true,
          numero: true,
          aquisicao: { select: { obraId: true } },
        },
      }),
      this.prisma.comprovantePagamento.findMany({
        where: { aquisicao: { obraId: inWorks }, imagemUrl: { not: null } },
        orderBy: asc,
        select: {
          imagemUrl: true,
          data: true,
          aquisicao: { select: { obraId: true } },
        },
      }),
      this.prisma.comprovanteVenda.findMany({
        where: { venda: { obraId: inWorks }, imagemUrl: { not: null } },
        orderBy: asc,
        select: {
          imagemUrl: true,
          data: true,
          venda: { select: { obraId: true } },
        },
      }),
    ]);

    const result = new Map<string, Map<string, ImageRef[]>>();
    const push = (
      obraId: string,
      section: string,
      url: string | null,
      caption: string,
    ) => {
      if (!url) return;
      const bySection = result.get(obraId) ?? new Map<string, ImageRef[]>();
      bySection.set(section, [
        ...(bySection.get(section) ?? []),
        { url, caption: caption.trim() || null },
      ]);
      result.set(obraId, bySection);
    };
    for (const item of certificados)
      push(
        item.catalogacao.obraId,
        'Catalogação',
        item.imagemUrl,
        'Certificado',
      );
    for (const item of assinaturas)
      push(
        item.catalogacao.obraId,
        'Catalogação',
        item.imagemUrl,
        `Assinatura — ${item.localAssinatura.nome}`,
      );
    for (const item of analises)
      push(
        item.analise.obraId,
        'Conservação',
        item.imagemUrl,
        item.creditos?.trim() || `Análise ${day(item.analise.data)}`,
      );
    for (const item of instrucoes)
      push(
        item.instrucao.obraId,
        'Instruções',
        item.imagemUrl,
        INSTRUCTION_LABEL[item.instrucao.tipo ?? ''] ?? 'Instrução',
      );
    for (const item of publicacoes)
      push(
        item.publicacao.obraId,
        'Pesquisa',
        item.imagemUrl,
        item.publicacao.titulo ?? 'Publicação',
      );
    for (const item of notas)
      push(
        item.aquisicao.obraId,
        'Aquisição',
        item.imagemUrl,
        `Nota fiscal ${item.numero ?? ''}`,
      );
    for (const item of pagamentos)
      push(
        item.aquisicao.obraId,
        'Aquisição',
        item.imagemUrl,
        `Comprovante de pagamento ${day(item.data)}`,
      );
    for (const item of vendas)
      push(
        item.venda.obraId,
        'Venda',
        item.imagemUrl,
        `Comprovante de venda ${day(item.data)}`,
      );
    return result;
  }

  /**
   * Converte as imagens já reduzidas ao tamanho de uso. Arquivo que não é
   * imagem (nota fiscal em PDF, por exemplo) fica de fora.
   */
  private async convertImages(items: ImageRef[], maxSize = 900) {
    const result: SheetImage[] = [];
    for (const item of items) {
      const image = await this.image(item.url, maxSize);
      if (image) result.push({ ...image, caption: item.caption });
    }
    return result;
  }

  /**
   * Imagem principal pronta para o PDF: girada pela orientação da câmera,
   * reduzida e convertida para JPEG (o pdfkit não lê WebP, AVIF, GIF, TIFF).
   * Falha ao ler ou converter vira "Sem imagem", sem derrubar a exportação.
   */
  private async image(url?: string | null, maxSize = 1400) {
    if (!url) return null;
    const original = await this.storage.read(url);
    if (!original) return null;
    try {
      const { data, info } = await sharp(original)
        .rotate()
        .resize({
          width: maxSize,
          height: maxSize,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .flatten({ background: '#ffffff' })
        .jpeg({ quality: 82 })
        .toBuffer({ resolveWithObject: true });
      return { data, width: info.width, height: info.height };
    } catch {
      return null;
    }
  }

  /** Ids das obras do escopo; null quando são todas do projeto. */
  private async resolveScope(
    projetoId: string,
    usuarioId: string,
    scope: ExportScopeDto,
  ) {
    if (scope.tipo === 'todas') return null;
    if (scope.tipo === 'obras') {
      if (!scope.obraIds?.length)
        throw new BadRequestException('Nenhuma obra para exportar.');
      return [...new Set(scope.obraIds)];
    }
    if (!scope.filtroId)
      throw new BadRequestException('Escolha o filtro salvo.');
    const filter = await this.prisma.filtroBuscaSalvo.findFirst({
      where: { id: scope.filtroId, projetoId, usuarioId },
    });
    if (!filter) throw new NotFoundException('Filtro não encontrado.');
    const works = await this.search.search(projetoId, {
      combinar: filter.combinar,
      condicoes: filter.condicoes as unknown as SearchConditionDto[],
    });
    return works.map((work) => work.id);
  }

  /** Rótulos das opções; localização vira o caminho inteiro ("Casa / Sala"). */
  private async context(projetoId: string): Promise<ExportContext> {
    const [options, locations] = await Promise.all([
      this.search.optionSources(projetoId),
      this.prisma.localizacao.findMany({
        where: { projetoId },
        select: { id: true, nome: true, paiId: true },
      }),
    ]);
    const labels = Object.fromEntries(
      Object.entries(options).map(([source, list]) => [
        source,
        new Map(
          list.map((option) => [
            option.value,
            option.label.replace(/^(— )+/, ''),
          ]),
        ),
      ]),
    ) as ExportContext['labels'];

    const byId = new Map(locations.map((row) => [row.id, row]));
    const path = (id: string) => {
      const names: string[] = [];
      const seen = new Set<string>();
      let cursor = byId.get(id);
      while (cursor && !seen.has(cursor.id)) {
        seen.add(cursor.id);
        names.unshift(cursor.nome);
        cursor = cursor.paiId ? byId.get(cursor.paiId) : undefined;
      }
      return names.join(' / ');
    };
    labels['localizacoes' satisfies OptionSource] = new Map(
      locations.map((row) => [row.id, path(row.id)]),
    );
    return { labels };
  }
}

/** Título como no card do acervo: "Título, série X, 1980". */
function displayTitle(work: {
  titulo: string | null;
  serie: boolean;
  tituloSerie: string | null;
  data: string | null;
}) {
  const base = work.titulo?.trim() || 'Sem título';
  const withSeries =
    work.serie && work.tituloSerie
      ? `${base}, série ${work.tituloSerie}`
      : base;
  return work.data?.trim() ? `${withSeries}, ${work.data.trim()}` : withSeries;
}

function slug(text: string) {
  return (
    text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'projeto'
  );
}
