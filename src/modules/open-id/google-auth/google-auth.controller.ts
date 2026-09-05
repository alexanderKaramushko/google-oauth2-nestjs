import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthGuard } from '../google-auth-strategy/google-auth.guard';
import {
  type Response as ExpressResponse,
  type Request as ExpressRequest,
} from 'express';

@Controller('auth')
export class GoogleAuthController {
  constructor(private googleAuthService: GoogleAuthService) {}

  @UseGuards(GoogleAuthGuard)
  @Get('login')
  login() {}

  @Get('logout')
  logout(@Response() response: ExpressResponse) {
    return this.googleAuthService.logout(response);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('callback')
  oauthCallback(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
  ) {
    return this.googleAuthService.oauthCallback(request, response);
  }
}
