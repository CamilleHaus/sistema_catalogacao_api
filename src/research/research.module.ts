import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';

@Module({
  imports: [AuthModule],
  controllers: [ResearchController],
  providers: [ResearchService],
})
export class ResearchModule {}
