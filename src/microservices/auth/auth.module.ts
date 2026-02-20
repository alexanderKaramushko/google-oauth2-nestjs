import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OAuthModule } from 'src/modules/oauth/oauth.module';

@Module({
  imports: [OAuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
