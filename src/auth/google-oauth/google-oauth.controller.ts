import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { GoogleOauthService } from './google-oauth.service';
import { GoogleOauthGuard } from '../google-oauth-strategy/google-oauth.guard';
import {
  type Response as ExpressResponse,
  type Request as ExpressRequest,
} from 'express';
import { AuthResult } from '../google-oauth-strategy/types';

@Controller('google-oauth')
export class GoogleOauthController {
  constructor(private googleOauthService: GoogleOauthService) {}

  @UseGuards(GoogleOauthGuard)
  @Get('login')
  login() {}

  @Get('logout')
  logout(@Response() response: ExpressResponse) {
    return this.googleOauthService.logout(response);
  }

  @UseGuards(GoogleOauthGuard)
  @Get('redirect')
  oauthRedirect(
    @Request() request: ExpressRequest & AuthResult,
    @Response() response: ExpressResponse,
  ) {
    return this.googleOauthService.oauthRedirect(request, response);
  }
}
