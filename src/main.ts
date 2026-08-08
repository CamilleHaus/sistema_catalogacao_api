import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import type { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AppConfig, true>);

  app.use(helmet());
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    credentials: true,
    origin: configService.get('app.webOrigin', { infer: true }),
  });

  app.enableShutdownHooks();
  await app.listen(configService.get('app.port', { infer: true }));
}
void bootstrap();
