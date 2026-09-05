import { Module } from '@nestjs/common';
import { GoogleAuthStrategy } from './google-auth-strategy/google-auth-strategy';
import { GoogleAuthController } from './google-auth/google-auth.controller';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleAuthGuard } from './google-auth-strategy/google-auth.guard';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TokenModule],
  providers: [GoogleAuthStrategy, GoogleAuthService, GoogleAuthGuard],
  controllers: [GoogleAuthController],
})
export class OpenIdModule {}
