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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clientes')
@Roles(PapelUsuario.ADMIN_EMPRESA)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  list(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.clientsService.list(currentUser);
  }

  @Post()
  create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: CreateClientDto,
  ) {
    return this.clientsService.create(currentUser, dto);
  }

  @Get(':clienteId')
  findOne(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('clienteId', new ParseUUIDPipe()) clienteId: string,
  ) {
    return this.clientsService.findOne(currentUser, clienteId);
  }

  @Patch(':clienteId')
  update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('clienteId', new ParseUUIDPipe()) clienteId: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.update(currentUser, clienteId, dto);
  }
}
