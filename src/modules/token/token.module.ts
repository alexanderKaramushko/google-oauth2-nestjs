import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      privateKey: process.env.PRIVATE_KEY,
      publicKey: process.env.PUBLIC_KEY,
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
