import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module';
import { User } from '../src/modules/users/user.model';
import { GoogleAuthStrategy } from '../src/modules/open-id/google-auth-strategy/google-auth-strategy';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getConnectionToken())
      .useValue({ close: jest.fn() })
      .overrideProvider(getModelToken(User.name))
      .useValue({})
      .overrideProvider(GoogleAuthStrategy)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });
});
