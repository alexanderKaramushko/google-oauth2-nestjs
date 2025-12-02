import { TestingModule } from '@nestjs/testing';
import { JwtGuard } from './jwt.guard';
import { createTestingModule } from 'src/helpers/createTestingModule';

describe('JwtGuard', () => {
  let provider: JwtGuard;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [JwtGuard],
    }).compile();

    provider = module.get<JwtGuard>(JwtGuard);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
