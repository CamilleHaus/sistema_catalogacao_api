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
import { StatusDto } from './dto/status.dto';
import { WorkStatusesService } from './work-statuses.service';

@Controller('status-obras')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class WorkStatusesController {
  constructor(private readonly service: WorkStatusesService) {}
  @Get() list(@CurrentUser() user: AuthenticatedUser) {
    return this.service.list(user);
  }
  @Post() @Roles(PapelUsuario.ADMIN_EMPRESA) create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: StatusDto,
  ) {
    return this.service.create(user, dto);
  }
  @Patch(':statusId') @Roles(PapelUsuario.ADMIN_EMPRESA) update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('statusId', new ParseUUIDPipe()) id: string,
    @Body() dto: StatusDto,
  ) {
    return this.service.update(user, id, dto);
  }
}
