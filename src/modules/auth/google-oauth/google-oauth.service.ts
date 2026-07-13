import {
  BadRequestException,
  Injectable,
  Request,
  Response,
} from '@nestjs/common';
import {
  type Response as ExpressResponse,
  type Request as ExpressRequest,
} from 'express';

@Injectable()
export class GoogleOauthService {
  constructor() {}

  logout(@Response() response: ExpressResponse) {
    response.clearCookie('jwt');

    return response.json('Logged out');
  }

  oauthRedirect(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
  ) {
    if (!request.user) {
      throw new BadRequestException('Пользователь не найден');
    }

    if (!request.authInfo) {
      throw new BadRequestException('Не найдены авторизационные данные');
    }

    const idToken = request.authInfo?.id_token;

    response.cookie('jwt', idToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    try {
      const apps: Record<string, string> = JSON.parse(
        process.env.OAUTH_CLIENT_APPS,
      );

      const app = Object.entries(apps).find(
        ([appId]) => appId === request.oauthState?.appId,
      );

      if (app) {
        return response.redirect(app[1]);
      } else {
        return response.json(request.user);
      }
    } catch {
      throw new BadRequestException('Ошибка редиректа после авторизации');
    }
  }
}
