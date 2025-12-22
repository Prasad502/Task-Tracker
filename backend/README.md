# Backend

Environment variables (see `.env.example`):

- PORT (default: 4000) — port for the Express server
- DATA_DIR (optional) — path to directory containing `tasks.json`, `sprints.json`, `people.json` (defaults to `./data`)
- SPRINT_EPOCH (default: 2025-01-01) — epoch date used to compute sprint periods
- SPRINT_LENGTH (default: 14) — sprint duration in days

After adding or editing `.env`, run:

```bash
npm install
npm start
```

(The project already depends on `dotenv` to load `.env` automatically.)
