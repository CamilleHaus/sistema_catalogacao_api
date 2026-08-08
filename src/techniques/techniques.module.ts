import { Module } from '@nestjs/common';
import { TechniquesController } from './techniques.controller';
import { TechniquesService } from './techniques.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TechniquesController],
  providers: [TechniquesService],
})
export class TechniquesModule {}
