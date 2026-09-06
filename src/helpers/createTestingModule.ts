import { ModuleMetadata } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModuleOptions } from '@nestjs/testing';
import { OAUTH_CLIENT } from 'src/modules/oauth/oauth.tokens';
import { TokenService } from 'src/modules/token/token.service';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from 'src/infra/config/config.module';

const testEnvironment: EnvironmentVariables = {
  NODE_ENV: 'test',
  CLIENT_ID: 'test_id',
  CLIENT_SECRET: 'test_secret',
  OAUTH_CALLBACK_URL: 'http://localhost/auth/callback',
  OAUTH_CLIENT_APPS: '{}',
  OAUTH_STATE_SECRET: 'test_state_secret',
  MONGO_DB_NAME: 'test',
  MONGO_DB_PORT: 27017,
  MONGO_DB_HOST: 'localhost',
  SERVICE_HOST: '0.0.0.0',
  SERVICE_PORT: 3001,
  MICROSERVICE_HOST: '0.0.0.0',
  MICROSERVICE_PORT: 3002,
  EXPIRES_IN: '1h',
  ISSUER: 'test_issuer',
  DOMAIN: 'localhost',
};

export function createConfigServiceMock() {
  return {
    get: jest.fn((key: keyof EnvironmentVariables) => testEnvironment[key]),
    getOrThrow: jest.fn((key: keyof EnvironmentVariables) => {
      const value = testEnvironment[key];

      if (value === undefined) {
        throw new Error(`Missing test environment variable: ${key}`);
      }

      return value;
    }),
  };
}

export function createTestingModule(
  metadata: ModuleMetadata,
  options?: TestingModuleOptions,
) {
  return Test.createTestingModule(
    {
      ...metadata,
      providers: [
        {
          provide: OAUTH_CLIENT,
          useFactory: () => ({
            verifyIdToken: () => ({}),
          }),
        },
        {
          provide: getModelToken('User'),
          useValue: {
            find: jest.fn().mockResolvedValue([
              {
                _id: 1,
                name: 'Alex',
                subjectId: 1,
                provider: 'google',
              },
            ]),
          },
        },
        {
          provide: TokenService,
          useValue: {
            createAccessToken: jest.fn(),
            isTokenVerified: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useFactory: createConfigServiceMock,
        },
        ...(metadata.providers ?? []),
      ],
    },
    options,
  );
}
