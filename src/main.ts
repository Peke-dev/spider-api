import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { configuration, GlobalConfigType } from './config';
import { AppModule } from './app.module';

let logger: Logger;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  logger = await app.resolve<Logger>(Logger);

  const config = await app.resolve<GlobalConfigType>(configuration.KEY);

  await app.listen(config.PORT);

  logger.log(`🚀 Server is listening on port ${config.PORT}`);
}

bootstrap().catch((error): void => {
  console.error(`🔥 Error starting server, ${error}`);
  process.exit();
});
