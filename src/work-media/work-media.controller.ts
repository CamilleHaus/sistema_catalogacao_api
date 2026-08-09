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
  CreateWorkAttachmentDto,
  CreateWorkImageDto,
  UpdateWorkAttachmentDto,
  UpdateWorkImageDto,
} from './dto/work-media.dto';
import { WorkMediaService } from './work-media.service';

@Controller('projetos/:projetoId/obras/:obraId')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class WorkMediaController {
  constructor(private readonly service: WorkMediaService) {}

  @Get('galeria')
  @RequireProjectAccess(PermissaoProjeto.VISUALIZAR)
  gallery(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
  ) {
    return this.service.gallery(p, w);
  }
  @Post('imagens')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  createImage(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: CreateWorkImageDto,
  ) {
    return this.service.createImage(p, w, dto);
  }
  @Patch('imagens/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updateImage(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWorkImageDto,
  ) {
    return this.service.updateImage(p, w, id, dto);
  }
  @Patch('imagens/:id/principal')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  setMain(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.setMain(p, w, id);
  }
  @Delete('imagens/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removeImage(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.removeImage(p, w, id);
  }

  @Get('anexos')
  @RequireProjectAccess(PermissaoProjeto.VISUALIZAR)
  attachments(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
  ) {
    return this.service.listAttachments(p, w);
  }
  @Post('anexos')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  createAttachment(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: CreateWorkAttachmentDto,
  ) {
    return this.service.createAttachment(p, w, dto);
  }
  @Patch('anexos/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updateAttachment(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWorkAttachmentDto,
  ) {
    return this.service.updateAttachment(p, w, id, dto);
  }
  @Delete('anexos/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removeAttachment(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.removeAttachment(p, w, id);
  }
}
