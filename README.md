# Google OAuth2 Auth Service

Сервис единой аутентификации на NestJS. Он запускает Google OAuth 2.0 flow,
сохраняет пользователей в MongoDB, устанавливает Google `id_token` в cookie и
подтверждает токен для HTTP-клиентов и внутренних TCP-сервисов.

## Возможности

Актуальный список задач и планы развития находятся в проекте [GitHub](https://github.com/users/alexanderKaramushko/projects/4).

## Архитектура

Сервис предоставляет два входа:

```text
HTTP-клиент
→ GoogleOauthController / UsersController
→ Guard / Passport Strategy / Service
→ UsersService
→ Mongoose
→ MongoDB

TCP-клиент
→ AuthController
→ JwtGuard
→ UsersService
→ Mongoose
→ MongoDB
```

Google подтверждает личность пользователя и валидность `id_token`. MongoDB
хранит локальную запись пользователя. Подробная схема приведена в
[обзоре архитектуры](https://google-oauth2-nestjs.vercel.app/architecture/overview.md).

## Технологический стек

- Node.js и TypeScript;
- NestJS 11, Express и NestJS Microservices;
- Passport и `passport-google-oauth2`;
- Google Auth Library;
- MongoDB, Mongoose и `@nestjs/mongoose`;
- Jest и Supertest;
- Docker, Docker Compose и pnpm;
- Docusaurus для проектной документации.

## Быстрый запуск

### Требования

- Node.js 20 или новее; Docker-образ использует Node.js 20, CI — Node.js 22;
- pnpm 10;
- MongoDB или Docker с поддержкой Docker Compose;
- OAuth-приложение в Google Cloud Console.

### Настройка окружения

Скопировать `.env.example` в `.env`:

```bash
cp .env.example .env
```

Основные переменные:

| Переменная            | Назначение                                                   |
| --------------------- | ------------------------------------------------------------ |
| `CLIENT_ID`           | Google OAuth client ID и ожидаемый `audience` для `id_token` |
| `CLIENT_SECRET`       | Google OAuth client secret                                   |
| `OAUTH_CALLBACK_HOST` | Публичный origin auth-сервиса без callback path              |
| `OAUTH_STATE_SECRET`  | Секрет подписи краткоживущего `state`                        |
| `OAUTH_CLIENT_APPS`   | JSON-объект `appId → URL` для редиректа после входа          |
| `MONGO_DB_HOST`       | Хост MongoDB                                                 |
| `MONGO_DB_PORT`       | Порт MongoDB                                                 |
| `MONGO_DB_NAME`       | Имя базы данных                                              |
| `SERVICE_HOST`        | Адрес HTTP-сервера; по умолчанию `0.0.0.0`                   |
| `SERVICE_PORT`        | Порт HTTP-сервера; по умолчанию `3001`                       |
| `MICROSERVICE_HOST`   | Адрес TCP-микросервиса; по умолчанию `0.0.0.0`               |
| `MICROSERVICE_PORT`   | Порт TCP-микросервиса; по умолчанию `3002`                   |
| `NODE_ENV`            | В `production` включает флаг `secure` у auth-cookie          |

Пример формата карты клиентских приложений:

```dotenv
OAUTH_CLIENT_APPS={"<app-id>":"http://localhost:3000"}
```

Callback URL в Google Cloud Console должен совпадать с:

```text
<OAUTH_CALLBACK_HOST>/google-oauth/redirect
```

### Запуск через Docker

Текущий `docker-compose.yml` запускает MongoDB и auth-сервис:

```bash
docker compose up -d
```

HTTP API публикуется на порту `3001`, TCP-микросервис — на `3002`, MongoDB —
на `27017`.

Остановить окружение:

```bash
docker compose down
```

### Локальный запуск

После настройки доступной MongoDB:

```bash
pnpm install --frozen-lockfile
pnpm start:dev
```

#### Туннелирование через tuna

Для локальной проверки Google OAuth callback можно опубликовать порт `3001`:

```bash
brew install yuccastream/tap/tuna
tuna config save-token <token>
tuna http 3001
```

Полученный origin необходимо добавить в Google Cloud Console и указать в
`OAUTH_CALLBACK_HOST`.

#### Отладка

Запустите приложение командой `pnpm start:debug`, затем подключитесь через
`chrome://inspect/#devices` или конфигурацию attach в VS Code.

## Миграции

Сервис использует MongoDB и Mongoose. Отдельного механизма миграций и
миграционных команд в проекте нет.

## Тестирование

```bash
pnpm test:unit
pnpm test:cov
pnpm test:e2e
```

Текущие unit-тесты в основном проверяют сборку модулей и providers. Существующий
e2e-тест сохранился от NestJS scaffold, ожидает `GET /` и пока не покрывает
OAuth flow, MongoDB или TCP-контракт.

Проверка типов и lint:

```bash
pnpm check:types
pnpm check:lint
```

## Документация

### Интерфейсы

#### HTTP

| Метод и путь                         | Назначение                                    |
| ------------------------------------ | --------------------------------------------- |
| `GET /google-oauth/login?appId=<id>` | начать Google OAuth flow                      |
| `GET /google-oauth/redirect`         | callback Google OAuth                         |
| `GET /google-oauth/logout`           | удалить локальную cookie `jwt`                |
| `GET /users/profile`                 | получить локальный профиль по текущему токену |

#### TCP

| Message pattern | Payload                    | Результат                                              |
| --------------- | -------------------------- | ------------------------------------------------------ |
| `auth.user`     | строка с Google `id_token` | массив локальных пользователей с соответствующим `sub` |

### Проектная документация

- [Бизнес-правила](https://google-oauth2-nestjs.vercel.app/business/business-rules.md)
- [Системная спецификация](https://google-oauth2-nestjs.vercel.app/system/system-specification.md)
- [Модель данных](https://google-oauth2-nestjs.vercel.app/system/data-model.md)
- [Обзор архитектуры](https://google-oauth2-nestjs.vercel.app/architecture/overview.md)
- [ADR: выпуск собственного JWT](https://google-oauth2-nestjs.vercel.app/architecture/adr/own-jwt.md)

### Локальный запуск документации

Установить зависимости сайта документации и запустить его локально:

```bash
pnpm --dir docs install --frozen-lockfile
pnpm docs:start
```

Статическая сборка:

```bash
pnpm docs:build
```

## Эксплуатация

Production-образ приложения собирается из корневого `Dockerfile`:

```bash
docker build -t google-oauth2-nestjs .
```

Для проверки production-сборки без Docker:

```bash
pnpm build
pnpm start:prod
```

Текущий `docker-compose.yml` предназначен для локального окружения. Отдельные
production-конфигурация и эксплуатационный runbook в репозитории отсутствуют.

## Релиз

Автоматизированный release workflow и порядок публикации образа в отслеживаемых
файлах репозитория не описаны.
