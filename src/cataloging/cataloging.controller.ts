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
import { RequireProjectAccess } from '../auth/decorators/require-project-access.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CatalogingService } from './cataloging.service';
import {
  CreateCertificateDto,
  CreateSignatureDto,
  SaveCatalogingDto,
} from './dto/cataloging.dto';

@Controller('projetos/:projetoId/obras/:obraId/catalogacao')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class CatalogingController {
  constructor(private readonly service: CatalogingService) {}
  @Get() @RequireProjectAccess(PermissaoProjeto.VISUALIZAR) get(
    @Param('projetoId', new ParseUUIDPipe()) project: string,
    @Param('obraId', new ParseUUIDPipe()) work: string,
  ) {
    return this.service.get(project, work);
  }
  @Put() @RequireProjectAccess(PermissaoProjeto.EDITAR) save(
    @Param('projetoId', new ParseUUIDPipe()) project: string,
    @Param('obraId', new ParseUUIDPipe()) work: string,
    @Body() dto: SaveCatalogingDto,
  ) {
    return this.service.save(project, work, dto);
  }
  @Post('assinaturas')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  addSignature(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: CreateSignatureDto,
  ) {
    return this.service.addSignature(p, w, dto);
  }
  @Patch('assinaturas/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updateSignature(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateSignatureDto,
  ) {
    return this.service.updateSignature(p, w, id, dto);
  }
  @Delete('assinaturas/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removeSignature(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.removeSignature(p, w, id);
  }
  @Post('certificados')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  addCertificate(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: CreateCertificateDto,
  ) {
    return this.service.addCertificate(p, w, dto);
  }
  @Patch('certificados/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updateCertificate(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateCertificateDto,
  ) {
    return this.service.updateCertificate(p, w, id, dto);
  }
  @Delete('certificados/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removeCertificate(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.removeCertificate(p, w, id);
  }
}
