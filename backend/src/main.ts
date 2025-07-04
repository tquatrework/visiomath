"use strict";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getDirname } from './common/utils/path-utils.js';
import { Logger, ValidationPipe } from '@nestjs/common';

const __dirname = getDirname(import.meta.url);

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule, {
  logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Activer CORS avec la liste d'origines autorisées
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://193.108.54.226:3000',
        'http://193.108.54.226:8080',
        'http://172.20.0.3:3000',
        'http://172.20.0.1:8080',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('CORS error: Origin not allowed by CORS:', origin);
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    credentials: true,
  });

  //app.enableCors();

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for the application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-docs', app, document); // Swagger accessible à l'URL /api

  global.console.log = (...args) => {
  process.stdout.write(args.join(' ') + '\n');
  };

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, 
    }),
  );

  await app.listen(5000);

}

bootstrap();