import { TestingModule } from '@nestjs/testing';
import { GoogleAuthStrategy } from './google-auth-strategy';
import { createTestingModule } from 'src/helpers/createTestingModule';
import { UsersService } from 'src/modules/users/users.service';

describe('GoogleAuthStrategy', () => {
  let provider: GoogleAuthStrategy;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [GoogleAuthStrategy, UsersService],
    }).compile();

    provider = module.get<GoogleAuthStrategy>(GoogleAuthStrategy);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
