import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GOOGLE_AUTH_STRATEGY_NAME } from './google-oauth-strategy';

@Injectable()
export class GoogleOauthGuard extends AuthGuard(GOOGLE_AUTH_STRATEGY_NAME) {}
