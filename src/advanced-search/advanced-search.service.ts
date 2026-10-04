import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CombinacaoFiltro, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { WorksService } from '../works/works.service';
import type {
  AdvancedSearchDto,
  SaveSearchFilterDto,
  SearchConditionDto,
} from './advanced-search.dto';
import {
  buildCondition,
  FIELDS_BY_ID,
  OPERATORS,
  SEARCH_FIELDS,
  type OptionSource,
  type ResolvedCondition,
  type SearchField,
} from './search-fields';

type Option = { value: string; label: string };

const NO_VALUE = new Set(['sim', 'nao']);
const NUMBER = /^\d+(\.\d+)?$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

@Injectable()
export class AdvancedSearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly works: WorksService,
  ) {}

  /** Campos com operadores e opções já resolvidas para este projeto. */
  async fields(projetoId: string) {
    const options = await this.optionSources(projetoId);
    return SEARCH_FIELDS.map((field) => ({
      id: field.id,
      label: field.label,
      grupo: field.group,
      tipo: field.type,
      operadores: OPERATORS[field.type],
      ...(field.source || field.enumOptions
        ? {
            opcoes: field.source ? options[field.source] : field.enumOptions,
          }
        : {}),
    }));
  }

  async search(projetoId: string, dto: AdvancedSearchDto) {
    const conditions = await this.resolve(projetoId, dto.condicoes);
    const clauses = conditions.map(buildCondition);
    return this.works.listWhere(projetoId, {
      ...(clauses.length === 0
        ? {}
        : dto.combinar === CombinacaoFiltro.TODAS
          ? { AND: clauses }
          : { OR: clauses }),
    });
  }

  listFilters(projetoId: string, usuarioId: string) {
    return this.prisma.filtroBuscaSalvo.findMany({
      where: { projetoId, usuarioId },
      orderBy: { nome: 'asc' },
    });
  }

  async createFilter(
    projetoId: string,
    usuarioId: string,
    dto: SaveSearchFilterDto,
  ) {
    await this.resolve(projetoId, dto.condicoes);
    return this.saving(() =>
      this.prisma.filtroBuscaSalvo.create({
        data: { projetoId, usuarioId, ...this.filterData(dto) },
      }),
    );
  }

  async updateFilter(
    projetoId: string,
    usuarioId: string,
    filtroId: string,
    dto: SaveSearchFilterDto,
  ) {
    await this.requireFilter(projetoId, usuarioId, filtroId);
    await this.resolve(projetoId, dto.condicoes);
    return this.saving(() =>
      this.prisma.filtroBuscaSalvo.update({
        where: { id: filtroId },
        data: this.filterData(dto),
      }),
    );
  }

  async removeFilter(projetoId: string, usuarioId: string, filtroId: string) {
    await this.requireFilter(projetoId, usuarioId, filtroId);
    await this.prisma.filtroBuscaSalvo.delete({ where: { id: filtroId } });
  }

  /** Valida cada condição contra o catálogo e normaliza o valor. */
  private async resolve(projetoId: string, conditions: SearchConditionDto[]) {
    const resolved = conditions.map((condition, index) =>
      this.validate(condition, index + 1),
    );
    if (resolved.some(({ field }) => field.expandTree)) {
      const expand = await this.locationExpander(projetoId);
      for (const condition of resolved) {
        if (condition.field.expandTree && Array.isArray(condition.value))
          condition.value = expand(condition.value);
      }
    }
    return resolved;
  }

  private validate(
    { campo, operador, valor }: SearchConditionDto,
    position: number,
  ): ResolvedCondition {
    const field = FIELDS_BY_ID.get(campo);
    const fail = (message: string): never => {
      throw new BadRequestException(`Condição ${position}: ${message}`);
    };
    if (!field) return fail(`o campo "${campo}" não existe mais na busca.`);
    if (!OPERATORS[field.type].includes(operador))
      return fail(`operador inválido para "${field.label}".`);
    if (NO_VALUE.has(operador)) return { field, operator: operador };

    if (field.type === 'opcao' || field.type === 'multipla') {
      if (
        !Array.isArray(valor) ||
        valor.length === 0 ||
        valor.length > 200 ||
        !valor.every((item) => typeof item === 'string' && item.length <= 100)
      )
        return fail(`escolha ao menos uma opção em "${field.label}".`);
      return { field, operator: operador, value: valor as string[] };
    }

    const single = (raw: unknown) => this.scalar(field, raw, fail);
    if (operador === 'entre') {
      if (!Array.isArray(valor) || valor.length !== 2)
        return fail(`informe o início e o fim em "${field.label}".`);
      const range: [string, string] = [single(valor[0]), single(valor[1])];
      if (this.compare(field, range[0], range[1]) > 0)
        return fail(`o início é maior que o fim em "${field.label}".`);
      return { field, operator: operador, value: range };
    }
    return { field, operator: operador, value: single(valor) };
  }

  private scalar(
    field: SearchField,
    raw: unknown,
    fail: (message: string) => never,
  ) {
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (!value) return fail(`informe um valor em "${field.label}".`);
    if (field.type === 'texto') {
      if (value.length > 300) return fail('texto longo demais.');
      return value;
    }
    if (field.type === 'data') {
      if (!DATE.test(value) || Number.isNaN(Date.parse(value)))
        return fail(`data inválida em "${field.label}".`);
      return value;
    }
    if (!NUMBER.test(value))
      return fail(`número inválido em "${field.label}".`);
    return value;
  }

  private compare(field: SearchField, a: string, b: string) {
    if (field.type === 'data') return a.localeCompare(b);
    return new Prisma.Decimal(a).comparedTo(new Prisma.Decimal(b));
  }

  /** "Está em X" vale para X e para todas as sublocalizações dele. */
  private async locationExpander(projetoId: string) {
    const rows = await this.prisma.localizacao.findMany({
      where: { projetoId },
      select: { id: true, paiId: true },
    });
    const children = new Map<string, string[]>();
    for (const row of rows) {
      if (!row.paiId) continue;
      children.set(row.paiId, [...(children.get(row.paiId) ?? []), row.id]);
    }
    return (ids: string[]) => {
      const result = new Set<string>();
      const queue = [...ids];
      while (queue.length > 0) {
        const id = queue.pop()!;
        if (result.has(id)) continue;
        result.add(id);
        queue.push(...(children.get(id) ?? []));
      }
      return [...result];
    };
  }

  /** Opções de cada cadastro para este projeto; também usado pela edição em massa. */
  async optionSources(
    projetoId: string,
  ): Promise<Record<OptionSource, Option[]>> {
    const project = await this.prisma.projeto.findUnique({
      where: { id: projetoId },
      select: { empresaId: true },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado.');
    const empresaId = project.empresaId;
    const byName = { orderBy: { nome: 'asc' as const } };
    const named = (rows: { id: string; nome: string }[]) =>
      rows.map((row) => ({ value: row.id, label: row.nome }));

    const [
      artistas,
      status,
      tecnicas,
      localizacoes,
      fichasMae,
      categorias,
      tags,
      locaisAssinatura,
      estadosConservacao,
      tiposServico,
      formasNegociacao,
      modalidadesSeguro,
    ] = await Promise.all([
      this.prisma.artista.findMany({ where: { empresaId }, ...byName }),
      this.prisma.statusObra.findMany({ where: { empresaId }, ...byName }),
      this.prisma.tecnica.findMany({
        where: { empresaId, OR: [{ projetoId: null }, { projetoId }] },
        ...byName,
      }),
      this.prisma.localizacao.findMany({ where: { projetoId }, ...byName }),
      this.prisma.fichaMae.findMany({
        where: { projetoId },
        orderBy: { codigo: 'asc' },
      }),
      this.prisma.categoriaCatalogacao.findMany({
        where: { empresaId },
        ...byName,
      }),
      this.prisma.tag.findMany({ where: { empresaId }, ...byName }),
      this.prisma.localAssinatura.findMany({ where: { empresaId }, ...byName }),
      this.prisma.estadoConservacao.findMany({
        where: { empresaId },
        ...byName,
      }),
      this.prisma.tipoServicoObra.findMany({ where: { empresaId }, ...byName }),
      this.prisma.formaNegociacao.findMany({ where: { empresaId }, ...byName }),
      this.prisma.modalidadeSeguro.findMany({
        where: { empresaId },
        ...byName,
      }),
    ]);

    return {
      artistas: named(artistas),
      status: named(status),
      tecnicas: named(tecnicas),
      localizacoes: this.locationOptions(localizacoes),
      fichasMae: fichasMae.map((item) => ({
        value: item.id,
        label: `${item.codigo} — ${item.descricao}`,
      })),
      categorias: named(categorias),
      tags: named(tags),
      locaisAssinatura: named(locaisAssinatura),
      estadosConservacao: named(estadosConservacao),
      tiposServico: named(tiposServico),
      formasNegociacao: named(formasNegociacao),
      modalidadesSeguro: named(modalidadesSeguro),
    };
  }

  /** Árvore achatada na ordem de leitura, com recuo por nível. */
  private locationOptions(
    rows: { id: string; nome: string; paiId: string | null }[],
  ) {
    const children = new Map<string | null, typeof rows>();
    for (const row of rows) {
      const parent = rows.some((item) => item.id === row.paiId)
        ? row.paiId
        : null;
      children.set(parent, [...(children.get(parent) ?? []), row]);
    }
    const result: Option[] = [];
    const visit = (parent: string | null, depth: number) => {
      for (const row of children.get(parent) ?? []) {
        result.push({
          value: row.id,
          label: `${'— '.repeat(depth)}${row.nome}`,
        });
        visit(row.id, depth + 1);
      }
    };
    visit(null, 0);
    return result;
  }

  private filterData(dto: SaveSearchFilterDto) {
    return {
      nome: dto.nome,
      combinar: dto.combinar,
      condicoes: dto.condicoes.map(({ campo, operador, valor }) => ({
        campo,
        operador,
        ...(valor === undefined ? {} : { valor }),
      })) as Prisma.InputJsonValue,
    };
  }

  private async requireFilter(
    projetoId: string,
    usuarioId: string,
    filtroId: string,
  ) {
    const filter = await this.prisma.filtroBuscaSalvo.findFirst({
      where: { id: filtroId, projetoId, usuarioId },
      select: { id: true },
    });
    if (!filter) throw new NotFoundException('Filtro não encontrado.');
  }

  private async saving<T>(run: () => Promise<T>) {
    try {
      return await run();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException('Você já tem um filtro com esse nome.');
      throw error;
    }
  }
}
