import { NestFactory } from '@nestjs/core';

import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

let logger: Logger;

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  logger = await app.resolve<Logger>(Logger);

  await app.listen(port);

  logger.log(`🚀 Server is listening on port ${port}`);
}

bootstrap().catch((error): void => {
  console.error(`🔥 Error starting server, ${error}`);
  process.exit();
});
