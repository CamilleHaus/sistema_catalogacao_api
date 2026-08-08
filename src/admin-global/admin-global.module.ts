import { Module } from '@nestjs/common';
import { AdminGlobalController } from './admin-global.controller';
import { AdminGlobalService } from './admin-global.service';

@Module({
  controllers: [AdminGlobalController],
  providers: [AdminGlobalService],
})
export class AdminGlobalModule {}
