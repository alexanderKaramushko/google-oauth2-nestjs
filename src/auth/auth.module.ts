import { Module } from '@nestjs/common';
import { GoogleOauthStrategy } from './google-oauth-strategy/google-oauth-strategy';
import { GoogleOauthController } from './google-oauth/google-oauth.controller';
import { GoogleOauthService } from './google-oauth/google-oauth.service';
import { GoogleOauthGuard } from './google-oauth-strategy/google-oauth.guard';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [GoogleOauthStrategy, GoogleOauthService, GoogleOauthGuard],
  controllers: [GoogleOauthController],
})
export class AuthModule {}
