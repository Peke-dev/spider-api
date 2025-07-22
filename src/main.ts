import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { configuration, GlobalConfigType } from './config';
import { AppModule } from './app.module';
import { CleanUndefinedPipe } from './infrastructure/pipes';
import { LoggerService } from '@modules/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = await app.resolve<LoggerService>(LoggerService);

  logger.setContext('Main');

  app.useLogger(logger);

  const config = await app.resolve<GlobalConfigType>(configuration.KEY);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
    new CleanUndefinedPipe(),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Spider Football API')
    .setDescription(
      'A powerful REST API for retrieving football (soccer) data including leagues, matches, and teams.',
    )
    .setVersion('1.0')
    .addBearerAuth();

  if (config.DOCS_SERVER_URL) {
    swaggerConfig.addServer(config.DOCS_SERVER_URL);
  }

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerConfig.build(),
  );

  SwaggerModule.setup('docs', app, swaggerDocument, {
    jsonDocumentUrl: 'docs/json',
    yamlDocumentUrl: 'docs/yaml',
  });

  await app.listen(config.PORT);

  logger.log(`🚀 Server is listening on port ${config.PORT}`);
}

bootstrap().catch((error): void => {
  console.error(`🔥 Error starting server, ${error}`);
  process.exit();
});
