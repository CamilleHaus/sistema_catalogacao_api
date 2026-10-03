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
import { ListWorkSetsQueryDto, SaveWorkSetDto } from './dto/work-set.dto';
import { WorkSetsService } from './work-sets.service';

/** Fichas mãe: informativo de um conjunto, com acesso pelo projeto a que pertencem. */
@Controller('fichas-mae')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class WorkSetsController {
  constructor(private readonly service: WorkSetsService) {}
  @Get() list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListWorkSetsQueryDto,
  ) {
    return this.service.list(user, query);
  }
  @Get(':fichaMaeId') findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('fichaMaeId', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.findOne(user, id);
  }
  @Post() create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SaveWorkSetDto,
  ) {
    return this.service.create(user, dto);
  }
  @Patch(':fichaMaeId') update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('fichaMaeId', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveWorkSetDto,
  ) {
    return this.service.update(user, id, dto);
  }
}
