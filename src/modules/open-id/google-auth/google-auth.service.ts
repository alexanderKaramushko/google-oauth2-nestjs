import { InternalServerErrorException, Injectable } from '@nestjs/common';
import { TokenService } from 'src/modules/token/token.service';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from 'src/infra/config/config.module';
import { User } from 'src/modules/users/user.model';

@Injectable()
export class GoogleAuthService {
  constructor(
    private tokenService: TokenService,
    private configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  processOAuthCallback(payload: { user?: User; appId?: string }) {
    const { user, appId } = payload;

    if (!user) {
      throw new InternalServerErrorException('Пользователь не найден');
    }

    if (!appId) {
      throw new InternalServerErrorException(
        'Не найдены авторизационные данные',
      );
    }

    let apps: Record<string, string> = {};

    try {
      apps = JSON.parse(
        this.configService.getOrThrow('OAUTH_CLIENT_APPS', { infer: true }),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Не удалось прочитать OAUTH_CLIENT_APPS: ${error.message}`,
      );
    }

    const app = Object.entries(apps).find(([envAppId]) => envAppId === appId);

    const accessToken = this.tokenService.createAccessToken({
      sub: user.subjectId,
    });

    return {
      accessToken,
      appUrl: app && app[1],
    };
  }
}
