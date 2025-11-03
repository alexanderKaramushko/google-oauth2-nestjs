import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { GoogleOauthService } from './google-oauth.service';
import { GoogleOauthGuard } from '../google-oauth.guard/google-oauth.guard';
import { type Response as ExpressResponse } from 'express';

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
    @Request() request: ExpressResponse,
    @Response() response: ExpressResponse,
  ) {
    return this.googleOauthService.oauthRedirect(request, response);
  }
}
