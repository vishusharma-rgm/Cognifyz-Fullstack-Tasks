# Task 6: Database Integration and User Authentication

This task builds a MERN-style app with MongoDB persistence and JWT authentication.

## Structure

- `backend`: Express API, MongoDB/Mongoose, bcrypt password hashing, JWT auth, protected CRUD routes.
- `frontend`: React login/signup flow, JWT storage in `localStorage`, authenticated CRUD requests.

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env` if your MongoDB connection string is different.

Backend URL: `http://localhost:6000`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5174`

## Auth Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`

## Data Endpoints

- `GET /api/data`
- `GET /api/data/:id`
- `POST /api/data` requires `Authorization: Bearer <token>`
- `PUT /api/data/:id` requires `Authorization: Bearer <token>`
- `DELETE /api/data/:id` requires `Authorization: Bearer <token>`

Only the owner of an entry can update or delete it.
