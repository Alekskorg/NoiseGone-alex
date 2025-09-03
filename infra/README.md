# NoiseGone Project

Это основной README для проекта NoiseGone.

## Запуск проекта

### 1. Бэкенд (FastAPI)

1.  **Установите Docker.**
2.  **Перейдите в директорию `infra`:** `cd infra`
3.  **Запустите контейнер:** `docker-compose up --build`
    Сервер будет доступен по адресу `http://localhost:8000`.

### 2. Фронтенд (Next.js)

1.  **Перейдите в директорию `frontend`:** `cd frontend`
2.  **Установите зависимости:** `npm install`
3.  **Создайте файл `.env.local`** и добавьте `FASTAPI_URL=http://localhost:8000`.
4.  **Запустите сервер для разработки:** `npm run dev`
    Приложение будет доступно по адресу `http://localhost:3000`.
