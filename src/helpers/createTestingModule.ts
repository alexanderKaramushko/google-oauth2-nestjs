import { ModuleMetadata } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModuleOptions } from '@nestjs/testing';
import { OAUTH_CLIENT } from 'src/modules/shared.module';
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
        ...(metadata.providers ?? []),
      ],
    },
    options,
  );
}
