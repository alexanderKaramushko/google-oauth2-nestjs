import { InternalServerErrorException } from '@nestjs/common';

export class GoogleAuthDataNotFoundException extends InternalServerErrorException {
  constructor() {
    super('Не найдены авторизационные данные');
  }
}
