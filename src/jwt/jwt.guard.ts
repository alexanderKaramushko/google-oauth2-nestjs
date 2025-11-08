import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { OAUTH_CLIENT } from 'src/modules/shared.module';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(@Inject(OAUTH_CLIENT) private oAuthClient: OAuth2Client) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies.jwt as string | null;

    if (!token) {
      throw new UnauthorizedException();
    }

    const ticket = await this.oAuthClient.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    return !!ticket;
  }
}
