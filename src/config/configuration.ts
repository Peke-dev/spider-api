import { registerAs } from '@nestjs/config';

export const configuration = registerAs('GLOBAL_CONFIG', () => {
  const NODE_ENV = process.env.NODE_ENV || 'dev';
  const DOCS_SERVER_URL =
    NODE_ENV === 'dev'
      ? `http://localhost:${process.env.PORT}`
      : process.env.DOCS_SERVER_URL || '';

  return {
    // App
    NODE_ENV,
    PORT: parseInt(process.env.PORT || '8080', 10),

    // Mongo
    MONGO_URI: process.env.MONGO_URI,

    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    LOG_PRETTY_PRINT: process.env.LOG_PRETTY_PRINT === 'true',
    LOG_FILE_PATH: process.env.LOG_FILE_PATH || './logs/app.log',
    LOG_MAX_SIZE: process.env.LOG_MAX_SIZE || '10m',
    LOG_MAX_FILES: parseInt(process.env.LOG_MAX_FILES || '5', 10),

    // Docs
    DOCS_SERVER_URL,
  };
});
