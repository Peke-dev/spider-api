import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { configuration, GlobalConfigType } from './config';
import { AppModule } from './app.module';
import { CleanUndefinedPipe } from './infrastructure/pipes';

let logger: Logger;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  logger = await app.resolve<Logger>(Logger);

  const config = await app.resolve<GlobalConfigType>(configuration.KEY);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      skipUndefinedProperties: true,
      skipNullProperties: true,
    }),
    new CleanUndefinedPipe(),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Spider Football API')
    .setDescription(
      'A powerful REST API for retrieving football (soccer) data including leagues, matches, and teams.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(config.PORT);

  logger.log(`🚀 Server is listening on port ${config.PORT}`);
}

bootstrap().catch((error): void => {
  console.error(`🔥 Error starting server, ${error}`);
  process.exit();
});
