import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from 'src/infra/config/config.module';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  createAccessToken(payload: { sub: string }) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      expiresIn: this.configService.getOrThrow('EXPIRES_IN', { infer: true }),
      issuer: this.configService.getOrThrow('ISSUER', { infer: true }),
    });
  }

  isTokenVerified(token: string) {
    try {
      return !!this.jwtService.verify(token, {
        algorithms: ['RS256'],
        issuer: this.configService.getOrThrow('ISSUER', { infer: true }),
      });
    } catch {
      return false;
    }
  }
}
