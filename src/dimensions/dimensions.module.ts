import { Module } from '@nestjs/common';
import { DimensionsController } from './dimensions.controller';
import { DimensionsService } from './dimensions.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DimensionsController],
  providers: [DimensionsService],
})
export class DimensionsModule {}
