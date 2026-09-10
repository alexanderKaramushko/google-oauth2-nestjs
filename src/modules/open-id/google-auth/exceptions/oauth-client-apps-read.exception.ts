import { InternalServerErrorException } from '@nestjs/common';

export class OAuthClientAppsReadException extends InternalServerErrorException {
  constructor(error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    super(`Не удалось прочитать OAUTH_CLIENT_APPS: ${errorMessage}`);
  }
}
