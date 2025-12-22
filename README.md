# Task Tracker

A lightweight task / sprint tracker with an Express backend (file-based JSON storage) and a React + Vite frontend.

---

## 🔧 Project structure

- `backend/` — Node.js + Express API
  - `server.js` — main server entry
  - `config.js` — env-based configuration
  - `routes/` — `tasks`, `sprints`, `people` routes
  - `data/` — JSON files used as a simple datastore

- `frontend/` — React app (Vite)
  - `src/` — components, pages, API helper
  - `public/`, `index.html`, Vite config

---

## 🚀 Quick start

### Backend

1. Open a terminal and go to `backend`
2. Install dependencies:

```bash
cd backend
npm install
```

3. Start server (options):

- Run with Node:

```bash
node server.js
```

- Or use nodemon for auto-reload (if installed globally) or via npx:

```bash
npx nodemon server.js
```

4. The server listens on `PORT` (default `4000`). See `config.js`.

Environment file: `backend/.env.example` (copy to `.env` to override `PORT` or `DATA_DIR`).

### Frontend

1. Open a terminal and go to `frontend`
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Run the dev server:

```bash
npm run dev
```

4. By default the frontend uses `http://localhost:4000` to reach the backend. You can set `VITE_API_URL` in a `.env` file in the `frontend` folder to point elsewhere.

---

## 🧭 API (backend)

Base URL: the `backend` server (default `http://localhost:4000`)

Tasks
- GET `/tasks` — list tasks, optional query `?sprintId=<id>`
- POST `/tasks` — create task
  - body example: `{ "title":"Task A", "description":"...", "effort": 3, "assignee": "<personId>", "sprintId": "<sprintId>" }`
- PUT `/tasks/:id` — update task (partial allowed)
- DELETE `/tasks/:id` — delete task
- GET `/tasks/summary/:sprintId` — returns a map of assignee -> total effort for sprint

Sprints
- GET `/sprints` — list sprints
- POST `/sprints` — create sprint `{ "name": "Sprint 1", "start": "2025-01-01", "end": "2025-01-14" }`
- DELETE `/sprints/:id`

People
- GET `/people` — list people
- POST `/people` — create person `{ "name": "Alice" }`
- DELETE `/people/:id` — remove person (their tasks get unassigned)

Notes: Data is stored in `backend/data/*.json`; you can change the directory via `DATA_DIR` env var.

---

## 🧩 Frontend notes

- Uses React + Vite and `axios` for API calls.
- Drag-and-drop is implemented with `@hello-pangea/dnd` on the Dashboard.
- Lookups (people/sprints) are cached by `useLookups` hook.
- API base is configured in `src/api.js` and reads `import.meta.env.VITE_API_URL`.

---

## 🛠️ Development tips

- The backend currently does not include a `start`/`dev` script in `package.json`. You can add these for convenience:

```json
// backend/package.json (example)
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

- To reset sample data, edit files in `backend/data/` (`people.json`, `sprints.json`, `tasks.json`).

---

## ✅ Contributing

- Prefer small, focused PRs.
- Add tests (if you add features) and update the README with any environment/config changes.

---

## 📜 License

Specify a license for the project (e.g., MIT). Currently no license file is included.

---

If you want, I can also:
- Add helpful `npm` scripts to `backend/package.json` ✅
- Create a `.env` example in `frontend` that documents `VITE_API_URL` ✅
- Add a more detailed API reference with sample cURL/Postman snippets ✅

