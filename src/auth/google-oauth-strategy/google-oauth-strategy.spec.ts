import { TestingModule } from '@nestjs/testing';
import { GoogleOauthStrategy } from './google-oauth-strategy';
import { createTestingModule } from 'src/helpers/createTestingModule';
import { UsersService } from 'src/users/users.service';

describe('GoogleOauthStrategy', () => {
  let provider: GoogleOauthStrategy;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [GoogleOauthStrategy, UsersService],
    }).compile();

    provider = module.get<GoogleOauthStrategy>(GoogleOauthStrategy);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
