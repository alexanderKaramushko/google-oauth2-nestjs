import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'test' | 'production';
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  OAUTH_CALLBACK_URL: string;
  OAUTH_CLIENT_APPS: string;
  OAUTH_STATE_SECRET: string;
  MONGO_DB_NAME: string;
  MONGO_DB_PORT: number;
  MONGO_DB_HOST: string;
  BOOTSTRAP_MICROSERVICE?: boolean;
  SERVICE_HOST: string;
  SERVICE_PORT: number;
  MICROSERVICE_HOST: string;
  MICROSERVICE_PORT: number;
  PRIVATE_KEY: string;
  PUBLIC_KEY: string;
  EXPIRES_IN: `${number}h`;
  ISSUER: string;
  DOMAIN: string;
}

const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  CLIENT_ID: Joi.string().trim().required(),
  CLIENT_SECRET: Joi.string().required(),
  OAUTH_CALLBACK_URL: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required(),
  OAUTH_CLIENT_APPS: Joi.string().default('{}'),
  OAUTH_STATE_SECRET: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().trim().required(),
  MONGO_DB_PORT: Joi.number().port().required(),
  MONGO_DB_HOST: Joi.string().trim().required(),
  BOOTSTRAP_MICROSERVICE: Joi.boolean().optional(),
  SERVICE_HOST: Joi.string().trim().default('0.0.0.0'),
  SERVICE_PORT: Joi.number().port().default(3001),
  MICROSERVICE_HOST: Joi.string().trim().default('0.0.0.0'),
  MICROSERVICE_PORT: Joi.number().port().default(3002),
  PRIVATE_KEY: Joi.string().required(),
  PUBLIC_KEY: Joi.string().required(),
  EXPIRES_IN: Joi.string()
    .pattern(/^\d+h$/)
    .required(),
  ISSUER: Joi.string().trim().required(),
  DOMAIN: Joi.string().hostname().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
