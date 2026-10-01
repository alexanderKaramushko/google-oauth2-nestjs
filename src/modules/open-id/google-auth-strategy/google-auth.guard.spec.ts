import { TestingModule } from '@nestjs/testing';
import { GoogleAuthGuard } from './google-auth.guard';
import { createTestingModule } from 'src/helpers/create-testing-module';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request as ExpressRequest } from 'express';
import { GoogleAuthInvalidStateException } from './exceptions/google-auth-invalid-state.exception';
import { GoogleAuthUserNotFoundException } from './exceptions/google-auth-user-not-found.exception';

describe('GoogleAuthGuard', () => {
  let provider: GoogleAuthGuard;

  const signMock = jest.fn();
  const verifyMock = jest.fn();
  const decodeMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [
        GoogleAuthGuard,
        {
          provide: JwtService,
          useValue: {
            sign: signMock,
            verify: verifyMock,
            decode: decodeMock,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (key) => {
              if (key === 'OAUTH_STATE_SECRET') {
                return 'secret';
              }

              return null;
            },
          },
        },
      ],
    }).compile();

    provider = module.get<GoogleAuthGuard>(GoogleAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('провайдер определен', () => {
    expect(provider).toBeDefined();
  });

  describe('Передача опций аутентификации', () => {
    it('state не передается в путь, отличный от /login', () => {
      const mockRequest = {
        url: '/id/callback',
        query: {},
      };

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      expect(
        provider.getAuthenticateOptions(mockExecutionContext),
      ).toBeUndefined();
    });

    it('создается state token для /login', () => {
      signMock.mockImplementation(() => 'token');

      const mockRequest = {
        url: '/login',
        query: { appId: 'app' },
      };

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      const value = provider.getAuthenticateOptions(mockExecutionContext);

      expect(signMock).toHaveBeenCalledWith(
        { appId: 'app' },
        { expiresIn: '5m', secret: 'secret' },
      );

      expect(value).toEqual({ state: 'token' });
    });
  });

  describe('Обработка ответа аутентификации', () => {
    let mockRequest: Pick<ExpressRequest, 'query' | 'oauthState'>;
    let mockExecutionContext: ExecutionContext;
    const user = { name: 'Name', subjectId: '1', provider: 'google' };

    beforeEach(() => {
      mockRequest = { query: { state: 'token' } };
      mockExecutionContext = {
        switchToHttp: () => ({ getRequest: () => mockRequest }),
      } as unknown as ExecutionContext;
    });

    it.each([undefined, ''])(
      'выбрасывает ошибку, если state отсутствует (%s)',
      (state) => {
        mockRequest.query.state = state;

        expect(() =>
          provider.handleRequest<typeof user>(
            null,
            user,
            null,
            mockExecutionContext,
          ),
        ).toThrow(GoogleAuthInvalidStateException);
        expect(verifyMock).not.toHaveBeenCalled();
        expect(decodeMock).not.toHaveBeenCalled();
        expect(mockRequest.oauthState).toBeUndefined();
      },
    );

    it('выбрасывает ошибку, если проверка state завершилась ошибкой', () => {
      verifyMock.mockImplementationOnce(() => {
        throw new Error('invalid token');
      });

      expect(() =>
        provider.handleRequest<typeof user>(
          null,
          user,
          null,
          mockExecutionContext,
        ),
      ).toThrow(GoogleAuthInvalidStateException);
      expect(decodeMock).not.toHaveBeenCalled();
      expect(mockRequest.oauthState).toBeUndefined();
    });

    it('пробрасывает ошибку аутентификации', () => {
      const error = new Error('Ошибка Passport');

      expect(() =>
        provider.handleRequest<typeof user>(
          error,
          user,
          null,
          mockExecutionContext,
        ),
      ).toThrow(error);
      expect(decodeMock).not.toHaveBeenCalled();
      expect(mockRequest.oauthState).toBeUndefined();
    });

    it('выбрасывает ошибку, если пользователь не найден', () => {
      expect(() =>
        provider.handleRequest<typeof user>(
          null,
          undefined,
          null,
          mockExecutionContext,
        ),
      ).toThrow(GoogleAuthUserNotFoundException);
      expect(decodeMock).not.toHaveBeenCalled();
      expect(mockRequest.oauthState).toBeUndefined();
    });

    it('возвращает пользователя и сохраняет декодированный state в запросе', () => {
      const oauthState = { appId: 'app' };
      decodeMock.mockReturnValueOnce(oauthState);

      expect(
        provider.handleRequest<typeof user>(
          null,
          user,
          null,
          mockExecutionContext,
        ),
      ).toBe(user);
      expect(verifyMock).toHaveBeenCalledWith('token', { secret: 'secret' });
      expect(decodeMock).toHaveBeenCalledWith('token');
      expect(mockRequest.oauthState).toBe(oauthState);
    });
  });
});
