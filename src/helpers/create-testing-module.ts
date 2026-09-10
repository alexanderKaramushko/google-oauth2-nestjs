import { InjectionToken, type ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ModuleMocker } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

export function mockToken(token: InjectionToken) {
  const mockMetadata = moduleMocker.getMetadata(token);

  if (!mockMetadata) {
    return undefined;
  }

  return moduleMocker.generateFromMetadata(mockMetadata);
}

/**
 * @description Хелпер для мокирования внешних зависимостей в юнит-тестах.
 * Мокируем абсолютно все, чтобы обеспечить максимальную изолированность тестов.
 *
 * Для точечного мокирования, например, для проверки работы методов с зависимостями,
 * нужно перезаписать useMocker на уровне теста.
 */
export function createTestingModule(moduleMetadata: ModuleMetadata = {}) {
  return Test.createTestingModule(moduleMetadata).useMocker(mockToken);
}
