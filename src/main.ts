import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',                        
      'https://honey-bloom-frontend.onrender.com',  
    ],
    credentials: true,
  });
  
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}

bootstrap();
