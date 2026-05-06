# ProjectFlow Dashboard

Professional project management dashboard with a structured Express REST API and a React sidebar interface.

## Required Run Order

1. Start MongoDB on `127.0.0.1:27017`.
2. Start the backend on port `5100`.
3. Start the frontend on port `5173`.

## Structure

- `backend`: Express API using controller-route-model organization.
- `frontend`: React dashboard using Axios for project CRUD interactions.

## Backend

```bash
cd backend
npm install
npm run dev
```

API URL: `http://localhost:5100`

Health check:

- `GET /`

Endpoints:

- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`
