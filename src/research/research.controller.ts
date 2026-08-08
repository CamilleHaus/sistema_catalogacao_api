import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PapelUsuario, PermissaoProjeto } from '@prisma/client';
import { RequireProjectAccess } from '../auth/decorators/require-project-access.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  AddPublicationImageDto,
  SaveCurriculumDto,
  SaveMuseumResearchDto,
  SavePublicationDto,
} from './dto/research.dto';
import { ResearchService } from './research.service';

@Controller('projetos/:projetoId/obras/:obraId/pesquisa')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class ResearchController {
  constructor(private readonly service: ResearchService) {}
  @Get()
  @RequireProjectAccess(PermissaoProjeto.VISUALIZAR)
  list(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
  ) {
    return this.service.list(p, w);
  }

  @Post('curriculos')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  createCurriculum(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: SaveCurriculumDto,
  ) {
    return this.service.createCurriculum(p, w, dto);
  }
  @Patch('curriculos/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updateCurriculum(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveCurriculumDto,
  ) {
    return this.service.updateCurriculum(p, w, id, dto);
  }
  @Delete('curriculos/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removeCurriculum(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.removeCurriculum(p, w, id);
  }

  @Post('publicacoes')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  createPublication(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: SavePublicationDto,
  ) {
    return this.service.createPublication(p, w, dto);
  }
  @Patch('publicacoes/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updatePublication(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SavePublicationDto,
  ) {
    return this.service.updatePublication(p, w, id, dto);
  }
  @Delete('publicacoes/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removePublication(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.removePublication(p, w, id);
  }
  @Post('publicacoes/:id/imagens')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  addImage(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AddPublicationImageDto,
  ) {
    return this.service.addPublicationImage(p, w, id, dto);
  }
  @Delete('publicacoes/:id/imagens/:imageId')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removeImage(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('imageId', new ParseUUIDPipe()) imageId: string,
  ) {
    return this.service.removePublicationImage(p, w, id, imageId);
  }

  @Post('museologicas')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  createMuseum(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: SaveMuseumResearchDto,
  ) {
    return this.service.createMuseumResearch(p, w, dto);
  }
  @Patch('museologicas/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updateMuseum(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveMuseumResearchDto,
  ) {
    return this.service.updateMuseumResearch(p, w, id, dto);
  }
  @Delete('museologicas/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removeMuseum(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.removeMuseumResearch(p, w, id);
  }
}
