import { registerAs } from '@nestjs/config';

export const configuration = registerAs('GLOBAL_CONFIG', () => {
  const NODE_ENV = process.env.NODE_ENV;

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

    // Docs
    DOCS_SERVER_URL,
  };
});
