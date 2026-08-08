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
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artistas')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class ArtistsController {
  constructor(private readonly service: ArtistsService) {}
  @Get() list(@CurrentUser() user: AuthenticatedUser) {
    return this.service.list(user);
  }
  @Get(':artistaId') findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('artistaId', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.findOne(user, id);
  }
  @Post() create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateArtistDto,
  ) {
    return this.service.create(user, dto);
  }
  @Patch(':artistaId') update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('artistaId', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateArtistDto,
  ) {
    return this.service.update(user, id, dto);
  }
}
