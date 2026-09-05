import { Module } from '@nestjs/common';
import { OAUTH_CLIENT } from './oauth.tokens';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from 'src/infra/config/config.module';

@Module({
  providers: [
    {
      provide: OAUTH_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) =>
        new OAuth2Client(
          configService.getOrThrow('CLIENT_SECRET', { infer: true }),
        ),
    },
  ],
  exports: [OAUTH_CLIENT],
})
export class OAuthModule {}
