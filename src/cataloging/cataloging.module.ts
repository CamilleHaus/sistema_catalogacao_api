import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CatalogingController } from './cataloging.controller';
import { CatalogingService } from './cataloging.service';
import { ReferenceDataController } from './reference-data.controller';
import { ReferenceDataService } from './reference-data.service';

@Module({
  imports: [AuthModule],
  controllers: [CatalogingController, ReferenceDataController],
  providers: [CatalogingService, ReferenceDataService],
})
export class CatalogingModule {}
