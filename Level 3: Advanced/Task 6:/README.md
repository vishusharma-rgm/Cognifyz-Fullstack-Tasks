# ProjectFlow Secure Portal

Enterprise-style secure project workspace with MongoDB persistence, JWT authentication, and owner-scoped project data.

## Required Run Order

1. Start MongoDB on `127.0.0.1:27017`.
2. Start the backend on port `6000`.
3. Start the frontend on port `5174`.

## Structure

- `backend`: Express, MongoDB/Mongoose, bcrypt, JWT, protected project routes, controller/service structure.
- `frontend`: React account access screen, secure token-based requests, private project dashboard.

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env` if your MongoDB connection string is different.

API URL: `http://localhost:6000`

Health check:

- `GET /`

Auth endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`

Protected project endpoints:

- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

All `/api/projects` routes require `Authorization: Bearer <token>`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5174`
