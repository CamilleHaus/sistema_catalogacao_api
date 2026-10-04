import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PapelUsuario, PermissaoProjeto } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequireProjectAccess } from '../auth/decorators/require-project-access.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdvancedSearchDto, SaveSearchFilterDto } from './advanced-search.dto';
import { AdvancedSearchService } from './advanced-search.service';

/**
 * Busca avançada do acervo de um projeto. Basta ver o projeto para buscar e
 * para guardar filtros: o filtro salvo é só do próprio usuário.
 */
@Controller('projetos/:projetoId/busca-avancada')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
@RequireProjectAccess(PermissaoProjeto.VISUALIZAR)
export class AdvancedSearchController {
  constructor(private readonly service: AdvancedSearchService) {}

  @Get('campos')
  fields(@Param('projetoId', new ParseUUIDPipe()) projetoId: string) {
    return this.service.fields(projetoId);
  }

  // POST porque as condições não cabem bem numa query string.
  @Post()
  @HttpCode(200)
  search(
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Body() dto: AdvancedSearchDto,
  ) {
    return this.service.search(projetoId, dto);
  }

  @Get('filtros')
  listFilters(
    @CurrentUser() user: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
  ) {
    return this.service.listFilters(projetoId, user.id);
  }

  @Post('filtros')
  createFilter(
    @CurrentUser() user: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Body() dto: SaveSearchFilterDto,
  ) {
    return this.service.createFilter(projetoId, user.id, dto);
  }

  @Put('filtros/:filtroId')
  updateFilter(
    @CurrentUser() user: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Param('filtroId', new ParseUUIDPipe()) filtroId: string,
    @Body() dto: SaveSearchFilterDto,
  ) {
    return this.service.updateFilter(projetoId, user.id, filtroId, dto);
  }

  @Delete('filtros/:filtroId')
  @HttpCode(204)
  removeFilter(
    @CurrentUser() user: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Param('filtroId', new ParseUUIDPipe()) filtroId: string,
  ) {
    return this.service.removeFilter(projetoId, user.id, filtroId);
  }
}
