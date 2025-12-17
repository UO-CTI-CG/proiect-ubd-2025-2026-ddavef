# Oradea2Wheels Frontend

This is a Vite + React + Bootstrap single-page UI that talks to the FastAPI backend.

## Getting started

```bash
cd frontend
npm install
npm run dev -- --host --port 5173
```

The dev server proxies `/api` to `http://localhost:8000`. You can override the backend URL with `VITE_API_BASE_URL` in a `.env` file.

## Available scripts

- `npm run dev` – start the Vite dev server
- `npm run build` – production build
- `npm run preview` – preview the production build
