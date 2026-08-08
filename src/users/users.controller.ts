import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PapelUsuario } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateUserDto } from './dto/create-user.dto';
import { ListCompanyUsersQueryDto } from './dto/list-users-query.dto';
import { ReactivateUserDto } from './dto/reactivate-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserProjectsDto } from './dto/update-user-projects.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('usuarios')
@Roles(PapelUsuario.ADMIN_EMPRESA)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: ListCompanyUsersQueryDto,
  ) {
    return this.usersService.list(currentUser, query);
  }

  @Post()
  create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.create(currentUser, dto);
  }

  @Get(':usuarioId')
  findOne(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('usuarioId', new ParseUUIDPipe()) usuarioId: string,
  ) {
    return this.usersService.findOne(currentUser, usuarioId);
  }

  @Patch(':usuarioId')
  update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('usuarioId', new ParseUUIDPipe()) usuarioId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(currentUser, usuarioId, dto);
  }

  @Patch(':usuarioId/papel')
  updateRole(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('usuarioId', new ParseUUIDPipe()) usuarioId: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.usersService.updateRole(currentUser, usuarioId, dto);
  }

  @Post(':usuarioId/desativar')
  deactivate(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('usuarioId', new ParseUUIDPipe()) usuarioId: string,
  ) {
    return this.usersService.deactivate(currentUser, usuarioId);
  }

  @Post(':usuarioId/reativar')
  reactivate(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('usuarioId', new ParseUUIDPipe()) usuarioId: string,
    @Body() dto: ReactivateUserDto,
  ) {
    return this.usersService.reactivate(currentUser, usuarioId, dto.projetos);
  }

  @Put(':usuarioId/projetos')
  updateProjects(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('usuarioId', new ParseUUIDPipe()) usuarioId: string,
    @Body() dto: UpdateUserProjectsDto,
  ) {
    return this.usersService.updateProjects(currentUser, usuarioId, dto);
  }
}
