import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PapelUsuario, PermissaoProjeto } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequireProjectAccess } from '../auth/decorators/require-project-access.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';

@Controller('projetos/:projetoId/localizacoes')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class LocationsController {
  constructor(private readonly service: LocationsService) {}

  @Get()
  @RequireProjectAccess(PermissaoProjeto.VISUALIZAR)
  list(@Param('projetoId', new ParseUUIDPipe()) projetoId: string) {
    return this.service.listTree(projetoId);
  }

  @Post()
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Body() dto: CreateLocationDto,
  ) {
    return this.service.create(user, projetoId, dto);
  }

  @Patch(':localizacaoId')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Param('localizacaoId', new ParseUUIDPipe()) localizacaoId: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.service.update(user, projetoId, localizacaoId, dto);
  }
}
