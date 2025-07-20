import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('dev', 'production', 'test'),
  PORT: Joi.number().default(8080),

  //Mongo
  MONGO_URI: Joi.string().required(),
});
