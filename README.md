# SSO-сервис на основе AS-сервиса Google OAuth 2.0 + Google Identity

## Алгоритм авторизации

Предусловия: пользователь не авторизован

## Как работает

1. Регистрируется приложение в Google console.cloud <br />
2. Создается стратегия passport-google-oauth2, 2.0 <br />
   согласно протоколу OAuth реализуется метод verify, который проверяет/создает пользователя и возвращает JWT <br />
3. Пробрасывается Client ID и Client secret приложения в стратегии passport-google-oauth2 <br />
4. Создается роут /auth/login для редиректа на Google-авторизацию <br />
5. Создается роут /oauth2/redirect/google, на которой происходит редирект после авторизации в Google <br />
6. На роуты из пунктов 3 и 5 навешиваются гарды, которые делают редиректы и verify-проверку <br />

<img width="428" height="244" alt="Снимок экрана 2025-11-02 в 23 50 56" src="https://github.com/user-attachments/assets/dd4e76cc-3fcf-4f2e-b788-58e827e67d02" />

## Архитектура

– Database module, модуль подключения к базе данных и создания DAO <br />
– User module, CRUD-сервис управления пользователями <br />
– Auth module, модуль аутентификации/авторизации пользователей <br />

Поднимается Docker-контейнеры c БД, сервером и Secret Vault.

## Стек технологий:

– @nestjs/jwt <br />
– @nestjs/passport, проверка кредов, выпуск токенов, обогащение запросов <br />
– passport-google-oauth2, стратегия аутентификации по OAuth 2.0 <br />
– passport-local <br />

## Отладка

**Через сокет в браузере**

1. Запустить веб-сокет для отладки: `start:debug` <br />
2. Перейти в chrome://inspect/#devices <br />
3. Нажать Inspect около директории с NestJS <br />

**Через подключение к процессу Node JS в VS Code**

1. Запустить разработку в режиме отладки V8: `start:debug` <br />
2. Запустить дебаггер через вкладку дебаггинга VS Code <br />
3. В консоли с запущенным Node JS процессом должна появится надпись "Debugger attached"

## Ресурсы

[Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2?hl=ru)
