import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get('health/ready')
  test(): string {
    return 'OK!';
  }
}
