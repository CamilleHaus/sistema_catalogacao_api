import { BadRequestException, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module';
import type { AppConfig } from '../config/app.config';
import { StorageController } from './storage.controller';
import { ACCEPTED_MIME_TYPES, StorageService } from './storage.service';

@Global()
@Module({
  imports: [
    AuthModule,
    // O arquivo fica em memória e segue direto para o storage — nada é gravado
    // em disco na API. O limite e o filtro valem para todo `FileInterceptor`.
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => ({
        limits: {
          files: 1,
          fileSize: config.get('storage.maxFileSizeBytes', { infer: true }),
        },
        fileFilter: (_req, file, callback) => {
          if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
            callback(
              new BadRequestException(
                'Formato não aceito. Envie imagem, PDF, documento, planilha, ' +
                  'apresentação, áudio, vídeo ou ZIP.',
              ),
              false,
            );
            return;
          }
          callback(null, true);
        },
      }),
    }),
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
