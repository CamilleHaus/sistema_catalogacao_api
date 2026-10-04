import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { PapelUsuario, PermissaoProjeto } from '@prisma/client';
import type { Response } from 'express';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequireProjectAccess } from '../auth/decorators/require-project-access.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ExportDto } from './export.dto';
import { ExportsService } from './exports.service';

/** Exportação de obras do projeto em PDF ou CSV. Basta poder ver o projeto. */
@Controller('projetos/:projetoId/exportacao')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
@RequireProjectAccess(PermissaoProjeto.VISUALIZAR)
export class ExportsController {
  constructor(private readonly service: ExportsService) {}

  @Get('campos')
  fields() {
    return this.service.fields();
  }

  @Post()
  @HttpCode(200)
  async export(
    @CurrentUser() user: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Body() dto: ExportDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.service.export(projetoId, user.id, dto);
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
      // O front lê o nome do arquivo daqui; sem isso o CORS o esconde.
      'Access-Control-Expose-Headers': 'Content-Disposition',
    });
    return new StreamableFile(file.body);
  }
}
