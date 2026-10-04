import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { validateEnvironment } from './config/environment.validation';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/access-token.guard';
import { ForcePasswordChangeGuard } from './auth/guards/force-password-change.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { AdminGlobalModule } from './admin-global/admin-global.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { ClientsModule } from './clients/clients.module';
import { ArtistsModule } from './artists/artists.module';
import { WorkStatusesModule } from './work-statuses/work-statuses.module';
import { TechniquesModule } from './techniques/techniques.module';
import { LocationsModule } from './locations/locations.module';
import { WorksModule } from './works/works.module';
import { AdvancedSearchModule } from './advanced-search/advanced-search.module';
import { BulkEditModule } from './bulk-edit/bulk-edit.module';
import { ExportsModule } from './exports/exports.module';
import { WorkSetsModule } from './work-sets/work-sets.module';
import { DimensionsModule } from './dimensions/dimensions.module';
import { WorkPhotosModule } from './work-photos/work-photos.module';
import { CatalogingModule } from './cataloging/cataloging.module';
import { ResearchModule } from './research/research.module';
import { FinancialModule } from './financial/financial.module';
import { WorkMediaModule } from './work-media/work-media.module';
import { ManagementModule } from './management/management.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
      validate: validateEnvironment,
    }),
    PrismaModule,
    AuthModule,
    AdminGlobalModule,
    UsersModule,
    ProjectsModule,
    ClientsModule,
    ArtistsModule,
    WorkStatusesModule,
    TechniquesModule,
    LocationsModule,
    WorksModule,
    AdvancedSearchModule,
    BulkEditModule,
    ExportsModule,
    WorkSetsModule,
    DimensionsModule,
    WorkPhotosModule,
    CatalogingModule,
    ResearchModule,
    FinancialModule,
    WorkMediaModule,
    ManagementModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    { provide: APP_GUARD, useClass: ForcePasswordChangeGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
