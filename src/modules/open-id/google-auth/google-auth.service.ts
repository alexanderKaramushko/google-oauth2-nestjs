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
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from 'src/infra/config/config.module';

@Injectable()
export class GoogleAuthService {
  constructor(
    private tokenService: TokenService,
    private configService: ConfigService<EnvironmentVariables, true>,
  ) {}

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
        this.configService.getOrThrow('OAUTH_CLIENT_APPS', { infer: true }),
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
          secure:
            this.configService.getOrThrow('NODE_ENV', { infer: true }) ===
            'production',
          domain: this.configService.getOrThrow('DOMAIN', { infer: true }),
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
