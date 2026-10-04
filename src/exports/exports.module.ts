import { Module } from '@nestjs/common';
import { AdvancedSearchModule } from '../advanced-search/advanced-search.module';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';
import { ExportsController } from './exports.controller';
import { ExportsService } from './exports.service';

@Module({
  imports: [AuthModule, AdvancedSearchModule, StorageModule],
  controllers: [ExportsController],
  providers: [ExportsService],
})
export class ExportsModule {}
