import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WorksModule } from '../works/works.module';
import { AdvancedSearchController } from './advanced-search.controller';
import { AdvancedSearchService } from './advanced-search.service';

@Module({
  imports: [AuthModule, WorksModule],
  controllers: [AdvancedSearchController],
  providers: [AdvancedSearchService],
  exports: [AdvancedSearchService],
})
export class AdvancedSearchModule {}
