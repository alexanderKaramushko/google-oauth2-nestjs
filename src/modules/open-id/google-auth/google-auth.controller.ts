import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthGuard } from '../google-auth-strategy/google-auth.guard';
import {
  type Response as ExpressResponse,
  type Request as ExpressRequest,
} from 'express';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/infra/config/config.module';

@Controller('id')
export class GoogleAuthController {
  constructor(
    private googleAuthService: GoogleAuthService,
    private configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  @UseGuards(GoogleAuthGuard)
  @Get('login')
  login() {}

  @Get('logout')
  logout(@Response() response: ExpressResponse) {
    response.clearCookie('access_token');

    return response.json('Logged out');
  }

  @UseGuards(GoogleAuthGuard)
  @Get('callback')
  oAuthCallback(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
  ) {
    const { accessToken, appUrl } = this.googleAuthService.processOAuthCallback(
      {
        user: request.user,
        appId: request.oauthState?.appId,
      },
    );

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure:
        this.configService.getOrThrow('NODE_ENV', { infer: true }) ===
        'production',
      domain: this.configService.getOrThrow('DOMAIN', { infer: true }),
    });

    if (appUrl) {
      return response.redirect(appUrl);
    } else {
      return response.json(request.user);
    }
  }
}
