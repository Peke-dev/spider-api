import { registerAs } from '@nestjs/config';

export const configuration = registerAs('GLOBAL_CONFIG', () => {
  return {
    //App
    NODE_ENV: process.env.NODE_ENV || 'dev',
    PORT: parseInt(process.env.PORT || '8080', 10),

    //Mongo
    MONGO_URI: process.env.MONGO_URI,
  };
});
