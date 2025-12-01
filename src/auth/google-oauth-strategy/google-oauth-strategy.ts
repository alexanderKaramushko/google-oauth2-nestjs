import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { UsersService } from 'src/users/users.service';
import { AuthInfo, GoogleProfile } from './types';
import { User } from 'src/users/user.model';
import { MicroservicesService } from 'src/microservices/microservices.service';

export const GOOGLE_AUTH_STRATEGY_NAME = 'google';

// Костыль: PassportStrategy оборачивает validate в callback,
// теряя арность метода validate
const VALIDATE_ARITY = 6;

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(
  Strategy,
  GOOGLE_AUTH_STRATEGY_NAME,
  VALIDATE_ARITY,
) {
  constructor(
    private usersService: UsersService,
    private microservices: MicroservicesService,
  ) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.OAUTH_CALLBACK_HOST + '/google-oauth/redirect',
      scope: ['profile', 'openid'],
      passReqToCallback: true,
    });
  }

  async validate(
    request,
    accessToken: string,
    refreshToken: string,
    result: AuthInfo,
    profile: GoogleProfile,
    done: VerifyCallback,
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

    try {
      await this.microservices.createGoalsUser({
        name: user.name,
        subjectId: user.subjectId,
      });
    } catch (error: any) {
      console.log(
        `Ошибка создания пользователя в сервисе целей: ${error.message}`,
      );
    }

    return done(null, { ...result, ...user });
  }
}
