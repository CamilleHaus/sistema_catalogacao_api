import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PapelUsuario } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateTechniqueDto } from './dto/create-technique.dto';
import { ListTechniquesQueryDto } from './dto/list-techniques-query.dto';
import { UpdateTechniqueDto } from './dto/update-technique.dto';
import { TechniquesService } from './techniques.service';

@Controller('tecnicas')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class TechniquesController {
  constructor(private readonly service: TechniquesService) {}
  @Get() list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListTechniquesQueryDto,
  ) {
    return this.service.list(user, query);
  }
  @Post() @Roles(PapelUsuario.ADMIN_EMPRESA) create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTechniqueDto,
  ) {
    return this.service.create(user, dto);
  }
  @Patch(':tecnicaId') @Roles(PapelUsuario.ADMIN_EMPRESA) update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tecnicaId', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTechniqueDto,
  ) {
    return this.service.update(user, id, dto);
  }
}
