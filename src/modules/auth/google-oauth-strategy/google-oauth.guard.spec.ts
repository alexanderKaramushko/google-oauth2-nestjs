import { TestingModule } from '@nestjs/testing';
import { GoogleOauthGuard } from './google-oauth.guard';
import { createTestingModule } from 'src/helpers/createTestingModule';

describe('GoogleOauthGuard', () => {
  let provider: GoogleOauthGuard;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [GoogleOauthGuard],
    }).compile();

    provider = module.get<GoogleOauthGuard>(GoogleOauthGuard);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
