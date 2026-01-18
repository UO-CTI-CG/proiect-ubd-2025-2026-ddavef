# Oradea2Wheels – Usage (Frontend + Backend)

This repository contains a Bike & Scooter rental demo application:
- **Backend**: FastAPI REST API (users, vehicles, rentals)
- **Frontend**: Vite + React + Bootstrap single-page UI

The recommended way to run the whole project locally is using the provided launcher script.

---

## Quick start (recommended)

### Prerequisites
- **Python 3**
- **Node.js + npm** (required for the frontend)

### Run everything with one command
From the repository root:

```bash
python start_all.py
```

What this does automatically:
- Verifies `backend/` and `frontend/` folders exist
- Initializes the database (creates tables if needed) and ensures an **admin** account exists
- Starts the backend with hot reload:
  - `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- Starts the frontend dev server:
  - `npm run dev -- --host --port 5173`

When it’s running:
- Backend: http://localhost:8000
- Backend API docs (Swagger): http://localhost:8000/docs
- Frontend: http://localhost:5173

Stop both servers with `Ctrl+C`.

---

## How the frontend reaches the backend (dev)

The frontend dev server proxies API calls from `/api/*` to the FastAPI server at `http://localhost:8000`.
This means the UI can call endpoints like:
- `/api/vehicles/`
- `/api/users/login`
- `/api/rentals/`

without needing to hard-code backend URLs during development.

You can override the backend base URL by setting `VITE_API_BASE_URL` in a `frontend/.env` file.

---

## Notes

- The default database is SQLite (a local file). The exact DB path/URL and admin credentials are configurable via environment variables (see `backend/.env.example`).
- Admin-only operations exist for managing vehicles and users.
