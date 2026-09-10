import { Injectable } from '@nestjs/common';
import { TokenService } from 'src/modules/token/token.service';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from 'src/infra/config/config.module';
import { User } from 'src/modules/users/user.model';
import { GoogleAuthUserNotFoundException } from './exceptions/google-auth-user-not-found.exception';
import { GoogleAuthDataNotFoundException } from './exceptions/google-auth-data-not-found.exception';
import { OAuthClientAppsReadException } from './exceptions/oauth-client-apps-read.exception';

@Injectable()
export class GoogleAuthService {
  constructor(
    private tokenService: TokenService,
    private configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  processOAuthCallback(payload: { user?: User; appId?: string }) {
    const { user, appId } = payload;

    if (!user) {
      throw new GoogleAuthUserNotFoundException();
    }

    if (!appId) {
      throw new GoogleAuthDataNotFoundException();
    }

    let apps: Record<string, string> = {};

    try {
      apps = JSON.parse(
        this.configService.getOrThrow('OAUTH_CLIENT_APPS', { infer: true }),
      );
    } catch (error) {
      throw new OAuthClientAppsReadException(error);
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
