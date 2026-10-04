import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { PapelUsuario, PermissaoProjeto } from '@prisma/client';
import { RequireProjectAccess } from '../auth/decorators/require-project-access.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { BulkEditDto } from './bulk-edit.dto';
import { BulkEditService } from './bulk-edit.service';

/** Altera um campo de várias obras do projeto de uma vez. */
@Controller('projetos/:projetoId/edicao-em-massa')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
@RequireProjectAccess(PermissaoProjeto.EDITAR)
export class BulkEditController {
  constructor(private readonly service: BulkEditService) {}

  @Get('campos')
  fields(@Param('projetoId', new ParseUUIDPipe()) projetoId: string) {
    return this.service.fields(projetoId);
  }

  @Post()
  @HttpCode(200)
  apply(
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Body() dto: BulkEditDto,
  ) {
    return this.service.apply(projetoId, dto);
  }
}
