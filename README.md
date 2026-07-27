# SSO-сервис на основе AS-сервиса Google OAuth 2.0 + Google Identity

## Документация

[Описание проекта](./docs/docs/project-spec.md) <br />
[Общее описание](./docs/docs/Документация/1-general-description.md) <br />
[Используемые технологии](./docs/docs/Документация/2-used-technologies.md) <br />

## dev-разработка

<strong>API</strong> <br />

[Log in](http://localhost:3001/google-oauth/login) <br />
[Log out (удаление куки)](http://localhost:3001/google-oauth/logout) <br />
[Full Log out (инвалидация сессии)](https://accounts.google.com/signout/chrome/landing?continue=https%3A%2F%2Faccounts.google.com%2FServiceLogin%3Felo%3D1) <br />

### Локальный запуск сервисов:

`docker compose up -d`

### Туннелирование через tuna

1. Создать reverse proxy публичный адрес -> приватный адрес: <br />
`brew install yuccastream/tap/tuna` <br />
`tuna config save-token <token>` <br />
`tuna http 3001` <br />
2. Добавить публичный адрес в сервис OAuth-авторизации в Google Console.
3. Указать публичный адрес в OAUTH_CALLBACK_HOST

## Отладка

**Через сокет в браузере**

1. Запустить веб-сокет для отладки: `start:debug` <br />
2. Перейти в chrome://inspect/#devices <br />
3. Нажать Inspect около директории с NestJS <br />

**Через подключение к процессу Node JS в VS Code**

1. Запустить разработку в режиме отладки V8: `start:debug` <br />
2. Запустить дебаггер через вкладку дебаггинга VS Code <br />
3. В консоли с запущенным Node JS процессом должна появится надпись "Debugger attached"

### TODO и техдолг

Другое:
* [x] ~~Добавить возможность редиректа в приложение через state, которое запросило авторизацию~~
* [ ] Вынести OAuth-клиент на общий слой без привязки к приложениям *
* [ ] Добавить Swagger *
* [ ] Далее настроить деплой релизов
* [ ] Настроить SHA-релизы c выпуском тэгов
* [ ] Возвращать только один элемент вместо массива в ручках на получение одной записи
