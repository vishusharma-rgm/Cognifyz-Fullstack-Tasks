# Workspace API Integrations

Advanced Workspace SaaS build with JWT auth, GitHub OAuth, GitHub repository sync, rate limiting, and global JSON error handling.

## Required Run Order

1. Start MongoDB on `127.0.0.1:27017`.
2. Create a GitHub OAuth app with callback `http://localhost:6000/api/auth/github/callback`.
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
- `FRONTEND_URL=http://localhost:5174`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_CALLBACK_URL=http://localhost:6000/api/auth/github/callback`

## API Surface

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/github`
- `GET /api/auth/github/callback`
- `GET /api/integrations/github/repos`
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

All protected routes require `Authorization: Bearer <token>`. API abuse protection is enabled with `express-rate-limit` at 100 requests per 15 minutes.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5174`
