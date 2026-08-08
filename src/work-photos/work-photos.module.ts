import { Module } from '@nestjs/common';
import { WorkPhotosController } from './work-photos.controller';
import { WorkPhotosService } from './work-photos.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WorkPhotosController],
  providers: [WorkPhotosService],
})
export class WorkPhotosModule {}
