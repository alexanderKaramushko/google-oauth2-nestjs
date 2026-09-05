import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OAuthModule } from 'src/modules/oauth/oauth.module';
import { TokenModule } from 'src/modules/token/token.module';

@Module({
  imports: [OAuthModule, TokenModule],
  controllers: [AuthController],
})
export class AuthModule {}
