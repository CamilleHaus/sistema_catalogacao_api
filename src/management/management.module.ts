import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import {
  ManagementAuxController,
  ManagementController,
} from './management.controller';
import { ManagementService } from './management.service';
@Module({
  imports: [AuthModule],
  controllers: [ManagementAuxController, ManagementController],
  providers: [ManagementService],
})
export class ManagementModule {}
