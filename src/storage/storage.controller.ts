import {
  BadRequestException,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PapelUsuario, PermissaoProjeto } from '@prisma/client';
import { RequireProjectAccess } from '../auth/decorators/require-project-access.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { StorageService } from './storage.service';

/**
 * Upload genérico do projeto: devolve a URL do arquivo já hospedado, que o
 * front manda em seguida para o campo de destino (foto principal, imagem da
 * galeria, anexo). Assim nenhum módulo de domínio precisa lidar com multipart.
 */
@Controller('projetos/:projetoId/arquivos')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
@RequireProjectAccess(PermissaoProjeto.EDITAR)
export class StorageController {
  constructor(private readonly service: StorageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('arquivo'))
  upload(
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Envie um arquivo em "arquivo".');
    return this.service.upload(file, `projetos/${projetoId}`);
  }
}
