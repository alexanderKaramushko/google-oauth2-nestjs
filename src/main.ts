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
      host: process.env.MICROSERVICE_HOST,
      port: Number.parseInt(process.env.MICROSERVICE_PORT ?? '3002', 10),
    },
  });

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  await app.startAllMicroservices();

  await app.listen(process.env.SERVICE_PORT ?? 3001);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
