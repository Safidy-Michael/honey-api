import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const allowedOrigins = [
    'http://localhost:8080', 
    //'https://honey-bloom-frontend.onrender.com', 
    'https://honey-bloom-frontend-crch.vercel.app',
    'https://honey-bloom-frontend-crch-7carzecrn-safidys-projects-7629980e.vercel.app',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });

  
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

 
  app.use(express.json());

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`Server is running on port ${PORT}`);
}

bootstrap();
