import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PapelUsuario, PermissaoProjeto } from '@prisma/client';
import { RequireProjectAccess } from '../auth/decorators/require-project-access.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateWorkDto } from './dto/create-work.dto';
import { ListWorksQueryDto } from './dto/list-works-query.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { WorksService } from './works.service';

@Controller('projetos/:projetoId/obras')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class WorksController {
  constructor(private readonly service: WorksService) {}
  @Get() @RequireProjectAccess(PermissaoProjeto.VISUALIZAR) list(
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Query() query: ListWorksQueryDto,
  ) {
    return this.service.list(projetoId, query);
  }
  @Get(':obraId') @RequireProjectAccess(PermissaoProjeto.VISUALIZAR) findOne(
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Param('obraId', new ParseUUIDPipe()) obraId: string,
  ) {
    return this.service.findOne(projetoId, obraId);
  }
  @Post() @RequireProjectAccess(PermissaoProjeto.EDITAR) create(
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Body() dto: CreateWorkDto,
  ) {
    return this.service.create(projetoId, dto);
  }
  @Patch(':obraId') @RequireProjectAccess(PermissaoProjeto.EDITAR) update(
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Param('obraId', new ParseUUIDPipe()) obraId: string,
    @Body() dto: UpdateWorkDto,
  ) {
    return this.service.update(projetoId, obraId, dto);
  }
}
