import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { PapelUsuario, PermissaoProjeto } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequireProjectAccess } from '../auth/decorators/require-project-access.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  AnalysisDto,
  AnalysisImageDto,
  InstructionDto,
  InstructionImageDto,
  MovementDto,
  NamedDto,
  ReportDto,
  RestorationDto,
  ServiceDto,
} from './dto/management.dto';
import { ManagementService } from './management.service';

@Controller('gestao-auxiliares')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class ManagementAuxController {
  constructor(private s: ManagementService) {}
  @Get() list(@CurrentUser() u: AuthenticatedUser) {
    return this.s.auxiliaries(u);
  }
  @Post('estados-conservacao') @Roles(PapelUsuario.ADMIN_EMPRESA) estado(
    @CurrentUser() u: AuthenticatedUser,
    @Body() d: NamedDto,
  ) {
    return this.s.createAux(u, 'estado', d.nome);
  }
  @Post('tipos-servico') @Roles(PapelUsuario.ADMIN_EMPRESA) tipo(
    @CurrentUser() u: AuthenticatedUser,
    @Body() d: NamedDto,
  ) {
    return this.s.createAux(u, 'tipo', d.nome);
  }
  @Patch('estados-conservacao/:id')
  @Roles(PapelUsuario.ADMIN_EMPRESA)
  updateEstado(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() d: NamedDto,
  ) {
    return this.s.updateAux(u, 'estado', id, d.nome);
  }
  @Patch('tipos-servico/:id')
  @Roles(PapelUsuario.ADMIN_EMPRESA)
  updateTipo(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() d: NamedDto,
  ) {
    return this.s.updateAux(u, 'tipo', id, d.nome);
  }
}

@Controller('projetos/:projetoId/obras/:obraId/gestao')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class ManagementController {
  constructor(private s: ManagementService) {}
  @Get() @RequireProjectAccess(PermissaoProjeto.VISUALIZAR) get(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
  ) {
    return this.s.get(p, w);
  }
  @Post('analises') @RequireProjectAccess(PermissaoProjeto.EDITAR) ca(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Body() d: AnalysisDto,
  ) {
    return this.s.createAnalysis(p, w, d);
  }
  @Patch('analises/:id') @RequireProjectAccess(PermissaoProjeto.EDITAR) ua(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
    @Body() d: AnalysisDto,
  ) {
    return this.s.updateAnalysis(p, w, i, d);
  }
  @Delete('analises/:id') @RequireProjectAccess(PermissaoProjeto.EDITAR) da(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
  ) {
    return this.s.remove(p, w, 'analise', i);
  }
  @Post('analises/:id/imagens')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  ai(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
    @Body() d: AnalysisImageDto,
  ) {
    return this.s.addAnalysisImage(p, w, i, d);
  }
  @Patch('analises/:id/imagens/:imageId')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  ui(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
    @Param('imageId', ParseUUIDPipe) x: string,
    @Body() d: AnalysisImageDto,
  ) {
    return this.s.updateAnalysisImage(p, w, i, x, d);
  }
  @Delete('analises/:id/imagens/:imageId')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  di(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
    @Param('imageId', ParseUUIDPipe) x: string,
  ) {
    return this.s.removeImage(p, w, 'analise', i, x);
  }
  @Post('restauros') @RequireProjectAccess(PermissaoProjeto.EDITAR) cr(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Body() d: RestorationDto,
  ) {
    return this.s.createRestoration(p, w, d);
  }
  @Patch('restauros/:id') @RequireProjectAccess(PermissaoProjeto.EDITAR) ur(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
    @Body() d: RestorationDto,
  ) {
    return this.s.updateRestoration(p, w, i, d);
  }
  @Delete('restauros/:id') @RequireProjectAccess(PermissaoProjeto.EDITAR) dr(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
  ) {
    return this.s.remove(p, w, 'restauro', i);
  }
  @Put('restauros/:id/relatorio')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  report(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
    @Body() d: ReportDto,
  ) {
    return this.s.report(p, w, i, d.url);
  }
  @Delete('restauros/:id/relatorio')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  delReport(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
  ) {
    return this.s.removeReport(p, w, i);
  }
  @Post('servicos') @RequireProjectAccess(PermissaoProjeto.EDITAR) cs(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Body() d: ServiceDto,
  ) {
    return this.s.createService(p, w, d);
  }
  @Patch('servicos/:id') @RequireProjectAccess(PermissaoProjeto.EDITAR) us(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
    @Body() d: ServiceDto,
  ) {
    return this.s.updateService(p, w, i, d);
  }
  @Delete('servicos/:id') @RequireProjectAccess(PermissaoProjeto.EDITAR) ds(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
  ) {
    return this.s.remove(p, w, 'servico', i);
  }
  @Post('instrucoes') @RequireProjectAccess(PermissaoProjeto.EDITAR) ci(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Body() d: InstructionDto,
  ) {
    return this.s.createInstruction(p, w, d);
  }
  @Patch('instrucoes/:id') @RequireProjectAccess(PermissaoProjeto.EDITAR) uin(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
    @Body() d: InstructionDto,
  ) {
    return this.s.updateInstruction(p, w, i, d);
  }
  @Delete('instrucoes/:id') @RequireProjectAccess(PermissaoProjeto.EDITAR) din(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
  ) {
    return this.s.remove(p, w, 'instrucao', i);
  }
  @Post('instrucoes/:id/imagens')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  ii(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
    @Body() d: InstructionImageDto,
  ) {
    return this.s.addInstructionImage(p, w, i, d.imagemUrl);
  }
  @Delete('instrucoes/:id/imagens/:imageId')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  dix(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
    @Param('imageId', ParseUUIDPipe) x: string,
  ) {
    return this.s.removeImage(p, w, 'instrucao', i, x);
  }
  @Post('movimentacoes') @RequireProjectAccess(PermissaoProjeto.EDITAR) cm(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Body() d: MovementDto,
  ) {
    return this.s.createMovement(p, w, d);
  }
  @Patch('movimentacoes/:id') @RequireProjectAccess(PermissaoProjeto.EDITAR) um(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
    @Body() d: MovementDto,
  ) {
    return this.s.updateMovement(p, w, i, d);
  }
  @Delete('movimentacoes/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  dm(
    @Param('projetoId', ParseUUIDPipe) p: string,
    @Param('obraId', ParseUUIDPipe) w: string,
    @Param('id', ParseUUIDPipe) i: string,
  ) {
    return this.s.remove(p, w, 'movimentacao', i);
  }
}
