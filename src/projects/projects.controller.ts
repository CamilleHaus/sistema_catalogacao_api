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
import type { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import { ReactivateProjectDto } from './dto/reactivate-project.dto';
import { UpdateProjectUsersDto } from './dto/update-project-users.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projetos')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  list(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: ListProjectsQueryDto,
  ) {
    return this.projectsService.list(currentUser, query);
  }

  @Post()
  @Roles(PapelUsuario.ADMIN_EMPRESA)
  create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.create(currentUser, dto);
  }

  @Get(':projetoId/reativacao')
  @Roles(PapelUsuario.ADMIN_EMPRESA)
  reactivationPreview(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
  ) {
    return this.projectsService.reactivationPreview(currentUser, projetoId);
  }

  @Post(':projetoId/reativar')
  @Roles(PapelUsuario.ADMIN_EMPRESA)
  reactivate(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Body() dto: ReactivateProjectDto,
  ) {
    return this.projectsService.reactivate(currentUser, projetoId, dto);
  }

  @Post(':projetoId/arquivar')
  @Roles(PapelUsuario.ADMIN_EMPRESA)
  archive(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
  ) {
    return this.projectsService.archive(currentUser, projetoId);
  }

  @Get(':projetoId/usuarios')
  @Roles(PapelUsuario.ADMIN_EMPRESA)
  listUsers(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
  ) {
    return this.projectsService.listUsers(currentUser, projetoId);
  }

  @Put(':projetoId/usuarios')
  @Roles(PapelUsuario.ADMIN_EMPRESA)
  updateUsers(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Body() dto: UpdateProjectUsersDto,
  ) {
    return this.projectsService.updateUsers(currentUser, projetoId, dto);
  }

  @Get(':projetoId')
  findOne(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
  ) {
    return this.projectsService.findOne(currentUser, projetoId);
  }

  @Patch(':projetoId')
  @Roles(PapelUsuario.ADMIN_EMPRESA)
  update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(currentUser, projetoId, dto);
  }
}
