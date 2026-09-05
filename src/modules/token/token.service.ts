import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createAccessToken(payload: { sub: string }) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      expiresIn: process.env.EXPIRES_IN,
      issuer: process.env.ISSUER,
    });
  }

  isTokenVerified(token: string) {
    try {
      return !!this.jwtService.verify(token, {
        algorithms: ['RS256'],
        issuer: process.env.ISSUER,
      });
    } catch {
      return false;
    }
  }
}
