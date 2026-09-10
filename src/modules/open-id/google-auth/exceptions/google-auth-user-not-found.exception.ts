import { InternalServerErrorException } from '@nestjs/common';

export class GoogleAuthUserNotFoundException extends InternalServerErrorException {
  constructor() {
    super('Пользователь не найден');
  }
}
