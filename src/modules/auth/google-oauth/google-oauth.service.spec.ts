import { TestingModule } from '@nestjs/testing';
import { GoogleOauthService } from './google-oauth.service';
import { createTestingModule } from 'src/helpers/createTestingModule';

describe('GoogleOauthService', () => {
  let service: GoogleOauthService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [GoogleOauthService],
    }).compile();

    service = module.get<GoogleOauthService>(GoogleOauthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
