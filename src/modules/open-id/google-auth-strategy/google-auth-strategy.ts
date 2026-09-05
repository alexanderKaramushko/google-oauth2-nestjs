import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
import { UsersService } from 'src/modules/users/users.service';
import { AuthInfo, GoogleProfile } from '../open-id.interface';
import { User } from 'src/modules/users/user.model';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from 'src/infra/config/config.module';

export const GOOGLE_AUTH_STRATEGY_NAME = 'google';

// Костыль: PassportStrategy оборачивает validate в callback,
// теряя арность метода validate
const VALIDATE_ARITY = 6;

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(
  Strategy,
  GOOGLE_AUTH_STRATEGY_NAME,
  VALIDATE_ARITY,
) {
  constructor(
    private usersService: UsersService,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      clientID: configService.getOrThrow('CLIENT_ID', { infer: true }),
      clientSecret: configService.getOrThrow('CLIENT_SECRET', { infer: true }),
      callbackURL: configService.getOrThrow('OAUTH_CALLBACK_URL', {
        infer: true,
      }),
      scope: ['profile', 'openid'],
      passReqToCallback: true,
      proxy: true,
    });
  }

  async validate(
    request,
    accessToken: string,
    refreshToken: string,
    authInfo: AuthInfo,
    profile: GoogleProfile,
  ) {
    const [maybeUser] =
      (await this.usersService.findByProvider(profile.id, profile.provider)) ??
      [];

    const userDocument =
      maybeUser ||
      (await this.usersService.create({
        subjectId: profile.id,
        provider: profile.provider,
        name: profile.displayName,
      }));

    const user: User = {
      name: userDocument.name,
      subjectId: userDocument.subjectId,
      provider: userDocument.provider,
    };

    return [user, authInfo];
  }
}
