import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export const configuration = registerAs('GLOBAL_CONFIG', () => {
  const { FIRESTORE_PRIVATE_KEY, FIRESTORE_PRIVATE_KEY_BASE_64 } = env;

  const fsPrivateKey = FIRESTORE_PRIVATE_KEY_BASE_64
    ? Buffer.from(FIRESTORE_PRIVATE_KEY_BASE_64, 'base64').toString('ascii')
    : FIRESTORE_PRIVATE_KEY;

  return {
    //App
    NODE_ENV: process.env.NODE_ENV || 'dev',
    PORT: parseInt(process.env.PORT || '3000'),

    //Firestore
    FIRESTORE_PROJECT_ID: process.env.FIRESTORE_PROJECT_ID,
    FIRESTORE_PRIVATE_KEY: fsPrivateKey,
    FIRESTORE_CLIENT_EMAIL: process.env.FIRESTORE_CLIENT_EMAIL,
  };
});
