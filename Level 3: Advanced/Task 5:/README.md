# Task 5: API Integration and Front-End Interaction

This task contains a minimal full-stack CRUD app.

## Structure

- `backend`: Node.js/Express REST API with in-memory task storage.
- `frontend`: React app that uses `fetch`, `useEffect`, create, edit, and delete actions.

## Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend URL: `http://localhost:5100`

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Endpoints

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
