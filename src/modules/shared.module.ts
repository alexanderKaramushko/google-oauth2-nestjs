import { Module, Global } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

export const OAUTH_CLIENT = 'OAUTH_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: OAUTH_CLIENT,
      useFactory: () => new OAuth2Client(process.env.CLIENT_SECRET),
    },
  ],
  exports: [OAUTH_CLIENT],
})
export class SharedModule {}
