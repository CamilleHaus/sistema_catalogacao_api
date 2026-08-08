import {
  Body,
  Controller,
  Delete,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { PapelUsuario, PermissaoProjeto, TipoDimensao } from '@prisma/client';
import { RequireProjectAccess } from '../auth/decorators/require-project-access.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { DimensionsService } from './dimensions.service';
import { UpsertDimensionDto } from './dto/upsert-dimension.dto';

@Controller('projetos/:projetoId/obras/:obraId/dimensoes')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
@RequireProjectAccess(PermissaoProjeto.EDITAR)
export class DimensionsController {
  constructor(private readonly service: DimensionsService) {}
  @Put(':tipo') upsert(
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Param('obraId', new ParseUUIDPipe()) obraId: string,
    @Param('tipo', new ParseEnumPipe(TipoDimensao)) tipo: TipoDimensao,
    @Body() dto: UpsertDimensionDto,
  ) {
    return this.service.upsert(projetoId, obraId, tipo, dto);
  }
  @Delete(':tipo') remove(
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Param('obraId', new ParseUUIDPipe()) obraId: string,
    @Param('tipo', new ParseEnumPipe(TipoDimensao)) tipo: TipoDimensao,
  ) {
    return this.service.remove(projetoId, obraId, tipo);
  }
}
