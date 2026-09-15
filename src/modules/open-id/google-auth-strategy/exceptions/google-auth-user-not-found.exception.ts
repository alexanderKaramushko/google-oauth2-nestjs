import { UnauthorizedException } from '@nestjs/common';

export class GoogleAuthUserNotFoundException extends UnauthorizedException {
  constructor() {
    super('Не найден пользователь');
  }
}
