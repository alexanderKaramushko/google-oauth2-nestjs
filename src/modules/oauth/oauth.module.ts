import { Module } from '@nestjs/common';
import { OAUTH_CLIENT } from './oauth.tokens';
import { OAuth2Client } from 'google-auth-library';

@Module({
  providers: [
    {
      provide: OAUTH_CLIENT,
      useFactory: () => new OAuth2Client(process.env.CLIENT_SECRET),
    },
  ],
  exports: [OAUTH_CLIENT],
})
export class OAuthModule {}
