import { ConfigService } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import { GoogleAuthStrategy } from './google-auth-strategy';
import { createTestingModule } from 'src/helpers/create-testing-module';
import { UsersService } from 'src/modules/users/users.service';

describe('GoogleAuthStrategy', () => {
  let provider: GoogleAuthStrategy;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [
        GoogleAuthStrategy,
        UsersService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('test'),
          },
        },
      ],
    }).compile();

    provider = module.get<GoogleAuthStrategy>(GoogleAuthStrategy);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
