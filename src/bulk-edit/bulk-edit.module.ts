import { Module } from '@nestjs/common';
import { AdvancedSearchModule } from '../advanced-search/advanced-search.module';
import { AuthModule } from '../auth/auth.module';
import { BulkEditController } from './bulk-edit.controller';
import { BulkEditService } from './bulk-edit.service';

@Module({
  imports: [AuthModule, AdvancedSearchModule],
  controllers: [BulkEditController],
  providers: [BulkEditService],
})
export class BulkEditModule {}
