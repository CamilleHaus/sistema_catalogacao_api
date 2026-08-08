import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { PapelUsuario, PermissaoProjeto } from '@prisma/client';
import { RequireProjectAccess } from '../auth/decorators/require-project-access.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateWorkPhotoDto } from './dto/update-work-photo.dto';
import { WorkPhotosService } from './work-photos.service';

@Controller('projetos/:projetoId/obras/:obraId/foto-principal')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
@RequireProjectAccess(PermissaoProjeto.EDITAR)
export class WorkPhotosController {
  constructor(private readonly service: WorkPhotosService) {}

  @Put()
  update(
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Param('obraId', new ParseUUIDPipe()) obraId: string,
    @Body() dto: UpdateWorkPhotoDto,
  ) {
    return this.service.update(projetoId, obraId, dto.url);
  }

  @Delete()
  remove(
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Param('obraId', new ParseUUIDPipe()) obraId: string,
  ) {
    return this.service.remove(projetoId, obraId);
  }
}
