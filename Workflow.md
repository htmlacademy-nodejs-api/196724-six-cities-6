# Как работать над проектом

## Окружение

Для удобства работы над проектом используются инструменты из **Node.js** и **npm**. Все необходимые настройки произведены. Убедитесь, что на рабочем компьютере установлен актуальный LTS релиз Node.js**. Актуальная версия **Node.js** указана в файле `package.json` в поле `node`. Затем, в терминале, перейдите в директорию с проектом и _единожды_ запустите команду:

```bash
npm install
```

Команда запустит процесс установки зависимостей проекта из **npm**.

### Environments (example)
```
PORT=4000 - Local connection port.
HOST=localhost - Local host name.
SALT=secret - Password hush secret.
DB_HOST=127.0.0.1 - Database host.
DB_PORT=27012 - Database port.
DB_USER=admin - Database user name.
DB_PASSWORD=test - Database user password.
DB_NAME=six-cities - Database name.
UPLOAD_DIRECTORY=/Users/il421/WebstormProjects/196724-six-cities-6/upload - Directory for upload files'
STATIC_DIRECTORY=/Users/il421/WebstormProjects/196724-six-cities-6/static - Directory for static files
JWT_SECRET=secret - JWT secret
JWT_EXPIRED=2d - JWT expired time

```

### Сценарии

В `package.json` предопределено несколько сценариев.

#### Скомпилировать проект

```bash
npm run compile
```

Создаст директорию `dist` и скомпилирует проект.

#### Удалить скомпилированный проект

```bash
npm run clean
```

Удаляет директорию `dist`. Используется перед компиляцией.

#### Собрать проект

```bash
npm run build
```

Выполняет сборку проекта: удаляет ранее скомпилированный проект и компилирует заново.

#### Проверить линтером

```bash
npm run lint
```

Запуск проверки проекта статическим анализатором кода **ESLint**.

Линтер проверяет файлы только внутри директории `src`.

**Обратите внимание**, при запуске данной команды, ошибки выводятся в терминал.

#### Запустить ts-модуль без компиляции

```bash
npm run ts -- <Путь к модулю с ts-кодом>
```

Пакет `ts-node` позволяет выполнить TS-код в Node.js без предварительной компиляции. Используется только на этапе разработки.

#### Запустить проект
##### Steps:
1. CLI
   - Run local JSON server `npm run run-json-server`.
   - Build and run Mongo DB from docker compose file `npm run docker-mongo`.
2. REST Application
   - Build and run Mongo DB from docker compose file `npm run docker-mongo`.
   - Build and run Application  `npm run start`, in development mode `npm run start:dev`.

##### Fill scripts list:
```bash
npm run start:dev
```
Running project in development mode.

```bash
npm start
```
В процессе запуска проекта будет выполнен процесс «Сборки проекта» и запуска результирующего кода.

```bash
npm run docker-mongo
```
Running Mongo DB in Docker container.

```bash
npm run run-json-server
```
It allows running a local JSON server with mocked data located in `mokes/mock-server-data.json`.

#### CLI commands
1. `npm run cli-help` - shows instruction in terminal.
2. `npm run cli-version` - shows the current project version.
3. `npm run cli-generate` - generate random offers data and write TSV file to /mocks.
4. ` npm run cli-import` - imports data from generated TSV file into MongoDB.
## Структура проекта

### Директория `src`

Исходный код проекта: компоненты, модули и так далее. Структура директории `src` может быть произвольной.

### Файл `Readme.md`

Инструкции по работе с учебным репозиторием.

### Файл `Contributing.md`

Советы и инструкции по внесению изменений в учебный репозиторий.

### Остальное

Все остальные файлы в проекте являются служебными. Пожалуйста, не удаляйте и не изменяйте их самовольно. Только если того требует задание или наставник.
