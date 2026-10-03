import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WorkSetsController } from './work-sets.controller';
import { WorkSetsService } from './work-sets.service';

@Module({
  imports: [AuthModule],
  controllers: [WorkSetsController],
  providers: [WorkSetsService],
})
export class WorkSetsModule {}
