import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/modules/token/token.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

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
