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
import { TokenService } from 'src/modules/token/token.service';

@Injectable()
export class GoogleAuthService {
  constructor(private tokenService: TokenService) {}

  logout(@Response() response: ExpressResponse) {
    response.clearCookie('access_token');

    return response.json('Logged out');
  }

  oauthCallback(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
  ) {
    if (!request.user) {
      throw new BadRequestException('Пользователь не найден');
    }

    if (!request.authInfo) {
      throw new BadRequestException('Не найдены авторизационные данные');
    }

    try {
      const apps: Record<string, string> = JSON.parse(
        process.env.OAUTH_CLIENT_APPS,
      );

      const app = Object.entries(apps).find(
        ([appId]) => appId === request.oauthState?.appId,
      );

      if (app) {
        const appUrl = app[1];

        const accessToken = this.tokenService.createAccessToken({
          sub: request.user.subjectId,
        });

        response.cookie('access_token', accessToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          domain: process.env.DOMAIN,
        });

        return response.redirect(appUrl);
      } else {
        return response.json(request.user);
      }
    } catch {
      throw new BadRequestException('Ошибка редиректа после авторизации');
    }
  }
}
