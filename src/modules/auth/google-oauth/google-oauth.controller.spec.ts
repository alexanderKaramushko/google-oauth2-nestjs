import { TestingModule } from '@nestjs/testing';
import { GoogleOauthController } from './google-oauth.controller';
import { createTestingModule } from 'src/helpers/createTestingModule';
import { GoogleOauthService } from './google-oauth.service';

describe('GoogleOauthController', () => {
  let controller: GoogleOauthController;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      controllers: [GoogleOauthController],
      providers: [GoogleOauthService],
    }).compile();

    controller = module.get<GoogleOauthController>(GoogleOauthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
