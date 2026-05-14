# Workspace Performance Backend

High-performance Workspace SaaS backend with security headers, request logging, Redis caching, Bull background jobs, and indexed MongoDB queries.

## Required Run Order

1. Start MongoDB on `127.0.0.1:27017`.
2. Start Redis locally or use a cloud Redis URL such as Upstash.
3. Start the backend on port `6000`.
4. Start the frontend on port `5174`.

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Required `.env` values:

- `MONGO_URI`
- `JWT_SECRET`
- `REDIS_URL=redis://127.0.0.1:6379`

## Performance Features

- `helmet` applies production HTTP security headers.
- `morgan` logs every request in `dev` or `combined` format.
- `GET /api/projects` reads from Redis first and stores fresh MongoDB results for 60 seconds.
- `POST`, `PUT`, and `DELETE /api/projects` invalidate the user-specific project cache.
- Bull schedules a repeated `weekly-project-summary` background job using Redis.
- Mongoose indexes optimize owner-scoped project queries and user email lookup.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5174`
