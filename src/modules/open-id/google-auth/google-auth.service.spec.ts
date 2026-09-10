import { TestingModule } from '@nestjs/testing';
import { GoogleAuthService } from './google-auth.service';
import { createTestingModule } from 'src/helpers/create-testing-module';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthUserNotFoundException } from './exceptions/google-auth-user-not-found.exception';
import { GoogleAuthDataNotFoundException } from './exceptions/google-auth-data-not-found.exception';
import { OAuthClientAppsReadException } from './exceptions/oauth-client-apps-read.exception';

describe('GoogleAuthService', () => {
  let service: GoogleAuthService;

  const getOrThrowMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [
        GoogleAuthService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: getOrThrowMock.mockImplementation((key) => {
              if (key === 'OAUTH_CLIENT_APPS') {
                return JSON.stringify({ 'app-1': 'https://app1.com' });
              }

              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GoogleAuthService>(GoogleAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('сервис определен', () => {
    expect(service).toBeDefined();
  });

  describe('processOauthCallback', () => {
    it('выбрасывает ошибку, если пользователь не найден', () => {
      expect(() => {
        service.processOAuthCallback({
          user: undefined,
          appId: 'goals',
        });
      }).toThrow(GoogleAuthUserNotFoundException);
    });

    it('выбрасывает ошибку, если не передан auth state', () => {
      expect(() => {
        service.processOAuthCallback({
          user: {
            name: 'Name',
            subjectId: '1',
            provider: 'google',
          },
        });
      }).toThrow(GoogleAuthDataNotFoundException);
    });

    it('выбрасывает ошибку, если OAUTH_CLIENT_APPS не удалось прочитать', () => {
      getOrThrowMock.mockReturnValue('invalid json');

      expect(() => {
        service.processOAuthCallback({
          user: {
            name: 'Name',
            subjectId: '1',
            provider: 'google',
          },
          appId: 'goals',
        });
      }).toThrow(OAuthClientAppsReadException);
    });
  });
});
