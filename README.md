# Проектная работа 11-го спринта

[Макет](<https://www.figma.com/file/vIywAvqfkOIRWGOkfOnReY/React-Fullstack_-Проектные-задачи-(3-месяца)_external_link?type=design&node-id=0-1&mode=design>)

[Чеклист](https://www.notion.so/praktikum/0527c10b723d4873aa75686bad54b32e?pvs=4)

## Этапы работы:

1. Разверните проект и ознакомьтесь с кодом. Все необходимые вам компоненты уже созданы и лежат в папке `src/components`

2. Настройте роутинг.

3. Напишите функционал запросов данных с сервера, используя `Redux` и глобальный `store`. Сами "ручки" уже прописаны и лежат в `utils/burger-api.ts`

4. Настройте авторизацию и создайте защищённые роуты.

## Важно:

Для корректной работы запросов к серверу необходимо добавить переменную BURGER_API_URL в окружение. Сама ссылка находится в файле `.env.example`.

## Тестирование (Jest и Cypress)

### Что нужно запустить перед Cypress

1. В одном терминале запустите приложение:

```bash
npm start
```

2. Дождитесь, пока приложение станет доступно по адресу `http://localhost:4000`.

### Запуск Jest-тестов

- Однократный запуск всех unit-тестов:

```bash
npm test
```

- Режим наблюдения (перезапуск тестов при изменениях):

```bash
npm run test:watch
```

### Запуск Cypress-тестов

- Интерактивный режим Cypress:

```bash
npm run cy:open
```

- Headless-режим (без UI):

```bash
npm run cy:run
```

- Запуск в Chrome:

```bash
npm run cy:open:chrome
npm run cy:run:chrome
```

### Если Cypress открывается белым экраном

На Windows иногда падает встроенный Electron-браузер Cypress. В таком случае:

1. Используйте запуск в Chrome/Edge.
2. Или запускайте тесты в headless-режиме:

```bash
npx cypress run --browser edge
```
