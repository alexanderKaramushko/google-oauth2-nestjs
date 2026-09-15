import { BadRequestException } from '@nestjs/common';

export class GoogleAuthInvalidStateException extends BadRequestException {
  constructor() {
    super('Ошибка авторизации через Google');
  }
}
