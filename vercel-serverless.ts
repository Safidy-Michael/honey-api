import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { Request, Response } from 'express';

let cachedApp: express.Express;

async function bootstrapServer() {
  if (!cachedApp) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter);

    app.enableCors({
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
    });

    await app.init();
    cachedApp = expressApp;
  }
  return cachedApp;
}


export default async function handler(req: Request, res: Response) {
  const app = await bootstrapServer();
  return app(req, res);
}
