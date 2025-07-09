import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Add this line to enable the global validation pipe ---
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3001;

  await app.listen(port);

  console.log(`Backend application is running on: http://localhost:${port}`);
}
bootstrap();
