import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from './infra/config/config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  app.use(cookieParser());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.getOrThrow('MICROSERVICE_HOST', { infer: true }),
      port: configService.getOrThrow('MICROSERVICE_PORT', { infer: true }),
    },
  });

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  await app.startAllMicroservices();

  await app.listen(
    configService.getOrThrow('SERVICE_PORT', { infer: true }),
    configService.getOrThrow('SERVICE_HOST', { infer: true }),
  );
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
