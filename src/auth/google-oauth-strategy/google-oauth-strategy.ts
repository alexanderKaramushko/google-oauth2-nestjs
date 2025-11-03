import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy as GoogleOauth,
  VerifyFunction,
} from 'passport-google-oauth2';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(GoogleOauth) {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.OAUTH_CALLBACK_HOST + '/google-oauth/redirect',
      scope: ['profile'],
    });
  }

  validate: VerifyFunction = (accessToken, refreshToken, profile, done) => {
    return done(null, { accessToken, refreshToken, ...profile });
  };
}
