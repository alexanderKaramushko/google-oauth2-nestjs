import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';
import { GOOGLE_AUTH_STRATEGY_NAME } from './google-auth-strategy';
import { JwtService } from '@nestjs/jwt';
import { Request as ExpressRequest } from 'express';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from 'src/infra/config/config.module';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(GOOGLE_AUTH_STRATEGY_NAME) {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super();
  }

  override getAuthenticateOptions(
    context: ExecutionContext,
  ): IAuthModuleOptions | undefined {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    if (request.url.includes('/google-oauth/redirect')) {
      return undefined;
    }

    const appId = request.query.appId;

    if (!appId) {
      throw new BadRequestException('Не найден идентификатор клиента');
    }

    const stateToken = this.jwtService.sign(
      { appId },
      {
        expiresIn: '5m',
        secret: this.configService.getOrThrow('OAUTH_STATE_SECRET', {
          infer: true,
        }),
      },
    );

    return {
      state: stateToken,
    };
  }

  override handleRequest<TUser = any>(
    error: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    const stateToken = request.query.state as string;

    try {
      if (!stateToken) {
        throw new Error('Невалидный state');
      }

      this.jwtService.verify(stateToken, {
        secret: this.configService.getOrThrow('OAUTH_STATE_SECRET', {
          infer: true,
        }),
      });
    } catch {
      throw new BadRequestException('Ошибка авторизации через Google');
    }

    if (error || !user) {
      throw error || new UnauthorizedException('Не найден польльзователь');
    }

    request.oauthState = this.jwtService.decode(stateToken);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
