import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get('health/live')
  live(): string {
    return 'OK!';
  }
}
