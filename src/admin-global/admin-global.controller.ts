import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PapelUsuario } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminGlobalService } from './admin-global.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateAdminStatusDto } from './dto/update-admin-status.dto';

@Controller('admin-global')
@Roles(PapelUsuario.ADMIN_GLOBAL)
export class AdminGlobalController {
  constructor(private readonly adminGlobalService: AdminGlobalService) {}

  @Post('empresas')
  createCompany(@Body() dto: CreateCompanyDto) {
    return this.adminGlobalService.createCompany(dto);
  }

  @Get('empresas')
  listCompanies() {
    return this.adminGlobalService.listCompanies();
  }

  @Get('usuarios')
  listUsers(@Query() query: ListUsersQueryDto) {
    return this.adminGlobalService.listUsers(query);
  }

  @Post('usuarios/:usuarioId/reset-senha')
  resetPassword(@Param('usuarioId') usuarioId: string) {
    return this.adminGlobalService.resetPassword(usuarioId);
  }

  @Patch('admins-empresa/:usuarioId/status')
  updateCompanyAdminStatus(
    @Param('usuarioId') usuarioId: string,
    @Body() dto: UpdateAdminStatusDto,
  ) {
    return this.adminGlobalService.updateCompanyAdminStatus(
      usuarioId,
      dto.ativo,
    );
  }
}
