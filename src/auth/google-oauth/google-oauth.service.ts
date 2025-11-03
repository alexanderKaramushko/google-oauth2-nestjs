import { Injectable, Response } from '@nestjs/common';
import { type Response as ExpressResponse } from 'express';

@Injectable()
export class GoogleOauthService {
  logout(@Response() response: ExpressResponse) {
    response.clearCookie('jwt');

    return response.json('Logged out');
  }

  oauthRedirect(request: any, response: ExpressResponse) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const jwtToken = request.user.accessToken;

    // // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    response.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    return response.json('Авторизован');
  }
}
