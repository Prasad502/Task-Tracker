# Backend

Environment variables (see `.env.example`):

- PORT (default: 4000) — port for the Express server
- DATA_DIR (optional) — path to directory containing `tasks.json`, `sprints.json`, `people.json` (defaults to `./data`)
- SPRINT_EPOCH (default: 2025-01-01) — epoch date used to compute sprint periods
- SPRINT_LENGTH (default: 14) — sprint duration in days
- SESSION_SECRET (required in production) — secret used to sign session cookies (default: 'devsecret' for local dev)
- SESSION_MAX_AGE (optional) — session cookie lifetime in milliseconds (default: 7 days)

Note: The default session store (MemoryStore) is not suitable for production. To persist sessions across server restarts or multiple instances, use a production store such as Redis (e.g., `connect-redis`) or a database-backed session store.

After adding or editing `.env`, run:

```bash
npm install
npm start
```

(The project already depends on `dotenv` to load `.env` automatically.)
