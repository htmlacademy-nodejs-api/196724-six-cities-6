# Руководство по работе с проектом

Данный проект создан с помощью [Create React App](https://github.com/facebook/create-react-app).

## Структура проекта

---

_Не удаляйте и не изменяйте папки и файлы:_
_`.editorconfig`, `.gitattributes`, `.gitignore`, `package.json`._

---

### public

Директория для размещения статичных ресурсов (шрифты, стили, изображения и так далее). Корневая директория проекта.

**Обратите внимание**, файл `Readme.md`, в директории `public`, содержит описание подготовительного процесса, который вам необходимо выполнить перед тем, как приступать к работе над проектом.

### src

В директории размещаются исходный код проекта: компоненты, файлы с тестами, модули и так далее. Структура директории `src` может быть произвольной.

## Сценарии

После создания проекта вам доступны следующие сценарии. Обратите внимание, для запуска сценария, вы должны находится в директории проекта (`./project`).

### Запуск проекта

```bash
npm start
```

После запуска, приложение доступно для просмотра в браузере по адресу [http://localhost:3000](http://localhost:3000).

При сохранении изменений, проект перезапускается и обновляется в браузере. Таким образом, вы можете следить за разработкой проекта в режиме реального времени.

**Обратите внимание**, режим разработки настроен таким образом, при котором ошибки, найденные статическим анализатором кода **ESLint**, отображаются в той же вкладке браузера, в которой запущен проект.

### Запуск тестов

```bash
npm test
```

Запуск тестов приложения в интерактивном режиме.

В данном случае, имеются в виду тесты, которые вынесены в отдельные файлы, в имени которых присутствует суффикс `*.test.*`. Например, `app.test.tsx`.

Подробную информацию вы можете найти на странице [Запуск тестов](https://facebook.github.io/create-react-app/docs/running-tests).

### Проверка линтером

```bash
npm run lint
```

Запуск проверки проекта статическим анализатором кода **ESLint**.

Анализ кода производится только в файлах, которые находятся в директории `src`.

**Обратите внимание**, при запуске данной команды, ошибки выводятся в терминал.

### Сборка проекта

```bash
npm run build
```

Запуск сборки приложения.

В процессе сборки приложения, код приложения оптимизируется и минимизируется, для достижения наилучшей производительности.

Во время выполнения инструкций по сборке проекта, в корне проекта создается директория `build`, в которую будут помещены результирующие файлы. После сборки проект готов к публикации.

Подробную информацию вы можете найти на странице [Развертывание проекта](https://facebook.github.io/create-react-app/docs/deployment).

### Извлечение конфигурации проекта

```bash
npm run eject
```

**Обратите внимание**, при запуске команды `npm run eject` нет возможности вернуть внесённые изменения обратно!

Выполнение данной команды, `react-scripts` скопирует все конфигурационные файлы и скрипты в корень проекта. Данный процесс позволяет получить полный контроль над конфигурацией проекта.

Не используйте данную команду, если не уверены как именно она работает или к какому результату приведёт ее выполнение.

### API resources
#### User
1. POST `users/create` - a new user sign-up.
```
{
  "name": "Test,",
  "email": "test@test.com,",
  "password": "123456"
}
```
2. POST `users/login` - a user sign-in.
```
{
  "email": "test@test.com,",
  "password": "123456"
}
```
3. GET `users/check` - a user authorisation check. 
4. POST `users/offers/favourite/add` - adding an offer from a user favourite list.
```
{
  "offerId": "string"
}
```
5. DELETE `users/offers/favourite/{offerId}/remove` - deleting an offer from a user favourite list.
```
{
  "offerId": "string"
}
```
6. POST `users/{id}/avatar` - a user avatar uploading.
```
form-data; name="avatar"; filename="file-name"
```
#### Offer
1. POST `offers/create` - a new offer.
```
{
  "name": "Good hotel",
  "description": "Very good hotel",
  "postDate": "2020-07-10",
  "city": "Auckland",
  "price": 2000,
  "previewUrl": "https://test.com/1",
  "urls": [
    "string"
  ],
  "type": "hotel",
  "bedrooms": 2,
  "guests": 1,
  "facilities": [
    "string"
  ],
  "location": {
    "long": -100.4,
    "lat": 100.56
  }
}
```
2. PATCH `offers/update/{id}` - allows updating an existing offer.
```
{
  "name": "Good hotel",
  "description": "Very good hotel",
  "postDate": "2020-07-10",
  "city": "Auckland",
  "price": 2000,
  "previewUrl": "https://test.com/1",
  "urls": [
    "string"
  ],
  "type": "hotel",
  "bedrooms": 2,
  "guests": 1,
  "facilities": [
    "string"
  ],
  "location": {
    "long": -100.4,
    "lat": 100.56
  }
}
```
3. DELETE `offers/delete/{id}` - allows deleting an existing offer.
4. GET `offers?limit=` - retrieve offers list. Default limit - 60 offers.
5. GET `offers/{id}` - retrieve individual full offer by id.
6. GET `offers/premium?city=` - retrieve three premium offers queried by city.
7. GET `offers/favourite` - retrieve favourites offers.

#### Comment
1. GET `comments/offer/{id}` - retrieve an offer comments list.
2. POST `comments/offer/create` - allows adding a new comment for an offer.
```
{
  "text": "string",
  "rating": 1,
  "publishDate": "2020-07-10"
}
```
