import { Module } from '@nestjs/common';
import { WorkStatusesController } from './work-statuses.controller';
import { WorkStatusesService } from './work-statuses.service';

@Module({
  controllers: [WorkStatusesController],
  providers: [WorkStatusesService],
})
export class WorkStatusesModule {}
