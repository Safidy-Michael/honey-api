import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedApp: express.Express;

async function bootstrapServer(): Promise<express.Express> {
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

export default async function handler(req: express.Request, res: express.Response) {

  console.log(`[HANDLER] Received request: ${req.method} ${req.url}`);

  const app = await bootstrapServer();

  // The express app instance is a request handler function.

  app(req, res);

}
