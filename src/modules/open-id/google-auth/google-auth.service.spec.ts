import { TestingModule } from '@nestjs/testing';
import { GoogleAuthService } from './google-auth.service';
import { createTestingModule } from 'src/helpers/createTestingModule';

describe('GoogleAuthService', () => {
  let service: GoogleAuthService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [GoogleAuthService],
    }).compile();

    service = module.get<GoogleAuthService>(GoogleAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
