import { Module } from '@nestjs/common';
import { OpenIdModule } from './modules/open-id/open-id.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule as MicroservicesAuthModule } from './microservices/auth/auth.module';
import { TokenModule } from './modules/token/token.module';

@Module({
  imports: [
    OpenIdModule,
    MicroservicesAuthModule,
    UsersModule,
    TokenModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`,
    ),
  ],
})
export class AppModule {}
