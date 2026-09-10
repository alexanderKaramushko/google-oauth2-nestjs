import { ConfigService } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';
import { createTestingModule } from 'src/helpers/create-testing-module';
import { Request, Response } from 'express';

describe('GoogleAuthController', () => {
  let controller: GoogleAuthController;

  const processOAuthCallbackMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      controllers: [GoogleAuthController],
      providers: [
        {
          provide: GoogleAuthService,
          useValue: {
            processOAuthCallback: processOAuthCallbackMock.mockReturnValue({
              accessToken: '1',
              appUrl: 'www.goals.com',
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GoogleAuthController>(GoogleAuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('контроллер определен', () => {
    expect(controller).toBeDefined();
  });

  it('добавляет access_token в куки запроса', () => {
    const cookieMock = jest.fn();

    controller.oAuthCallback(
      {} as unknown as Request,
      {
        cookie: cookieMock,
        json: () => {},
        redirect: () => {},
      } as unknown as Response,
    );

    expect(cookieMock).toHaveBeenCalledTimes(1);
    expect(cookieMock).toHaveBeenCalledWith('access_token', '1', {
      domain: undefined,
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
  });

  it('редирект по url из appId, если найден', () => {
    const redirectMock = jest.fn();

    controller.oAuthCallback(
      {} as unknown as Request,
      {
        cookie: () => {},
        json: () => {},
        redirect: redirectMock,
      } as unknown as Response,
    );

    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('www.goals.com');
  });

  it('возвращает пользователя, если не найден appId', () => {
    processOAuthCallbackMock.mockReturnValue({
      accessToken: '1',
      appUrl: undefined,
    });

    const jsonMock = jest.fn();

    controller.oAuthCallback(
      {
        user: {
          name: 'Name',
          subjectId: '1',
          provider: 'google',
        },
      } as unknown as Request,
      {
        cookie: () => {},
        redirect: () => {},
        json: jsonMock,
      } as unknown as Response,
    );

    expect(jsonMock).toHaveBeenCalledTimes(1);
    expect(jsonMock).toHaveBeenCalledWith({
      name: 'Name',
      subjectId: '1',
      provider: 'google',
    });
  });
});
