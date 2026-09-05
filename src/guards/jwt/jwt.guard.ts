import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { OAUTH_CLIENT } from 'src/modules/oauth/oauth.tokens';
import { TokenService } from 'src/modules/token/token.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @Inject(OAUTH_CLIENT) private oAuthClient: OAuth2Client,
    private tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const token =
      context.getType() === 'rpc'
        ? context.switchToRpc().getData<string | null>()
        : (context.switchToHttp().getRequest<Request>().cookies.access_token as
            | string
            | null);

    if (!token) {
      throw new UnauthorizedException();
    }

    if (!this.tokenService.isTokenVerified(token)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
