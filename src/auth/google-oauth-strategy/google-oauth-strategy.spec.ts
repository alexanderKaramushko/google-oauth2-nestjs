import { Test, TestingModule } from '@nestjs/testing';
import { GoogleOauthStrategy } from './google-oauth-strategy';

describe('GoogleOauthStrategy', () => {
  let provider: GoogleOauthStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleOauthStrategy],
    }).compile();

    provider = module.get<GoogleOauthStrategy>(GoogleOauthStrategy);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
