import { TestingModule } from '@nestjs/testing';
import { GoogleAuthGuard } from './google-auth.guard';
import { createTestingModule } from 'src/helpers/create-testing-module';

describe('GoogleAuthGuard', () => {
  let provider: GoogleAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [GoogleAuthGuard],
    }).compile();

    provider = module.get<GoogleAuthGuard>(GoogleAuthGuard);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
