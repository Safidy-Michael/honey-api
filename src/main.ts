import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.use((req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins = [
      'https://honey-bloom-frontend-crch.vercel.app',
      'http://localhost:3000'
    ];
    const origin = req.headers.origin;
    
    if (origin && allowedOrigins.includes(origin as string)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
   
    if (req.method === 'OPTIONS') {
      console.log('OPTIONS preflight handled');
      return res.status(200).send();
    }
    
    next();
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });
  
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Application running on port ${PORT}`);
}

bootstrap();