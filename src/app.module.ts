import { Module } from '@nestjs/common';
import { OpenIdModule } from './modules/open-id/open-id.module';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule as MicroservicesAuthModule } from './microservices/auth/auth.module';
import { TokenModule } from './modules/token/token.module';
import { AppConfigModule } from './infra/config/config.module';
import type { EnvironmentVariables } from './infra/config/config.module';

@Module({
  imports: [
    AppConfigModule,
    OpenIdModule,
    MicroservicesAuthModule,
    UsersModule,
    TokenModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        uri: `mongodb://${configService.getOrThrow('MONGO_DB_HOST', { infer: true })}:${configService.getOrThrow('MONGO_DB_PORT', { infer: true })}/${configService.getOrThrow('MONGO_DB_NAME', { infer: true })}`,
      }),
    }),
  ],
})
export class AppModule {}
