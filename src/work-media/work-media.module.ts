import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WorkMediaController } from './work-media.controller';
import { WorkMediaService } from './work-media.service';

@Module({
  imports: [AuthModule],
  controllers: [WorkMediaController],
  providers: [WorkMediaService],
})
export class WorkMediaModule {}
