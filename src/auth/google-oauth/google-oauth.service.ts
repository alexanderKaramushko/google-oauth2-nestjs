import { Injectable, Request, Response } from '@nestjs/common';
import {
  type Response as ExpressResponse,
  type Request as ExpressRequest,
} from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthResult } from '../google-oauth-strategy/types';

@Injectable()
export class GoogleOauthService {
  constructor(private usersService: UsersService) {}

  logout(@Response() response: ExpressResponse) {
    response.clearCookie('jwt');

    return response.json('Logged out');
  }

  oauthRedirect(
    @Request() request: ExpressRequest & AuthResult,
    @Response() response: ExpressResponse,
  ) {
    const idToken = request.user.id_token;

    // // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    response.cookie('jwt', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return response.json(request.user);
  }
}
