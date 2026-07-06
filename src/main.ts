import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.MICROSERVICE_HOST ?? '0.0.0.0',
      port: Number.parseInt(process.env.MICROSERVICE_PORT ?? '3002', 10),
    },
  });

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  await app.startAllMicroservices();

  await app.listen(
    Number.parseInt(process.env.SERVICE_PORT ?? '3001', 10),
    process.env.SERVICE_HOST ?? '0.0.0.0',
  );
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
