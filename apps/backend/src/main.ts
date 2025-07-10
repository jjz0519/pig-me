import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable transformation in the global validation pipe
  app.useGlobalPipes(
      new ValidationPipe({
        transform: true, // This is the key change
        transformOptions: {
          enableImplicitConversion: true, // Allows for automatic conversion of primitive types
        },
        whitelist: true, // Strips away properties that do not have any decorators
      }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  await app.listen(port);

  console.log(`Backend application is running on: http://localhost:${port}`);
}
bootstrap();