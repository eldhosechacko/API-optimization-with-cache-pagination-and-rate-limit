/*
----------------------------------------------------------------------
File: /src/main.ts
----------------------------------------------------------------------
This is the application's entry point. It creates the NestJS app instance
and starts the server.
*/
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use a global validation pipe to ensure all incoming data is validated
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip away properties that do not have any decorators
    transform: true, // Transform payload objects to be objects of the DTO type
  }));
  
  // Enable CORS for frontend applications to connect
  app.enableCors();

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();