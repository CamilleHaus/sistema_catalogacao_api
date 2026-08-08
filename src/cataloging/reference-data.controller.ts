import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PapelUsuario } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SaveNameDto, SaveTagDto } from './dto/cataloging.dto';
import { ReferenceDataService } from './reference-data.service';

@Controller()
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class ReferenceDataController {
  constructor(private readonly service: ReferenceDataService) {}
  @Get('categorias-catalogacao') categories(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.list(user, 'categoria');
  }
  @Post('categorias-catalogacao') createCategory(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SaveNameDto,
  ) {
    return this.service.create(user, 'categoria', dto);
  }
  @Patch('categorias-catalogacao/:id') updateCategory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveNameDto,
  ) {
    return this.service.update(user, 'categoria', id, dto);
  }
  @Get('tags') tags(@CurrentUser() user: AuthenticatedUser) {
    return this.service.list(user, 'tag');
  }
  @Post('tags') createTag(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SaveTagDto,
  ) {
    return this.service.create(user, 'tag', dto);
  }
  @Patch('tags/:id') updateTag(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveTagDto,
  ) {
    return this.service.update(user, 'tag', id, dto);
  }
  @Get('locais-assinatura') locations(@CurrentUser() user: AuthenticatedUser) {
    return this.service.list(user, 'local');
  }
  @Post('locais-assinatura') createLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SaveNameDto,
  ) {
    return this.service.create(user, 'local', dto);
  }
  @Patch('locais-assinatura/:id') updateLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveNameDto,
  ) {
    return this.service.update(user, 'local', id, dto);
  }
  @Get('formas-negociacao') negotiationForms(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.list(user, 'forma');
  }
  @Post('formas-negociacao') createNegotiationForm(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SaveNameDto,
  ) {
    return this.service.create(user, 'forma', dto);
  }
  @Patch('formas-negociacao/:id') updateNegotiationForm(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveNameDto,
  ) {
    return this.service.update(user, 'forma', id, dto);
  }
  @Get('modalidades-seguro') insuranceTypes(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.list(user, 'modalidade');
  }
  @Post('modalidades-seguro') createInsuranceType(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SaveNameDto,
  ) {
    return this.service.create(user, 'modalidade', dto);
  }
  @Patch('modalidades-seguro/:id') updateInsuranceType(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveNameDto,
  ) {
    return this.service.update(user, 'modalidade', id, dto);
  }
}
