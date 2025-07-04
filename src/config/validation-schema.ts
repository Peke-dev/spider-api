import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('dev', 'production', 'test'),
  PORT: Joi.number().default(8080),

  //Firestore
  FIRESTORE_PROJECT_ID: Joi.string().required(),
  FIRESTORE_PRIVATE_KEY: Joi.string(),
  FIRESTORE_CLIENT_EMAIL: Joi.string().required(),

  //App
  JWT_SECRET: Joi.string().required(),

  //Mongo
  MONGO_URI: Joi.string().required(),
});
