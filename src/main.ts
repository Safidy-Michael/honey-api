import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import serverless from 'serverless-http';

async function createApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['https://honey-bloom-frontend-crch.vercel.app', 'http://localhost:8080'],
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });
  return app;
}

export const handler = serverless(async () => {
  const app = await createApp();
  return app.getHttpAdapter().getInstance();
});

if (require.main === module) {
  (async () => {
    const app = await createApp();
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
    console.log(`Server running on port ${PORT}`);
  })();
}
