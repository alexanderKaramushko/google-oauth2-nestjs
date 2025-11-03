import { Test, TestingModule } from '@nestjs/testing';
import { GoogleOauthGuard } from './google-oauth.guard';

describe('GoogleOauthGuard', () => {
  let provider: GoogleOauthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleOauthGuard],
    }).compile();

    provider = module.get<GoogleOauthGuard>(GoogleOauthGuard);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
