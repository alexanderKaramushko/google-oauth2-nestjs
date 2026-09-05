import { ModuleMetadata } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModuleOptions } from '@nestjs/testing';
import { OAUTH_CLIENT } from 'src/modules/oauth/oauth.tokens';
import { TokenService } from 'src/modules/token/token.service';

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
        ...(metadata.providers ?? []),
      ],
    },
    options,
  );
}
