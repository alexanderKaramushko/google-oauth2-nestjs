import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MicroservicesService } from './microservices.service';
import { GOALS_SERVICE } from './tokens';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: GOALS_SERVICE,
      useFactory: (configService: ConfigService) => {
        const host = configService.get('MICROSERVICE_HOST');
        const port = configService.get('MICROSERVICE_PORT');

        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host,
            port: Number.parseInt(port as string, 10),
          },
        });
      },
      inject: [ConfigService],
    },
    MicroservicesService,
  ],
  exports: [MicroservicesService],
})
export class MicroservicesModule {}
