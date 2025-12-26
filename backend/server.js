require('dotenv').config();
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const taskRoutes = require("./routes/tasks");
const sprintRoutes = require("./routes/sprints");
const peopleRoutes = require("./routes/people");
const authRoutes = require("./routes/auth");
const config = require('./config');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  // Refresh cookie expiry on each response so active users stay logged in
  rolling: true,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    // default to 7 days (in ms); override with SESSION_MAX_AGE env var
    maxAge: process.env.SESSION_MAX_AGE ? Number(process.env.SESSION_MAX_AGE) : 7 * 24 * 60 * 60 * 1000,
    // set secure cookies in production (requires HTTPS)
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/sprints", sprintRoutes);
app.use("/people", peopleRoutes);

app.get('/', (_, res) =>
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173')
);

app.listen(config.PORT, () => console.log(`Backend running on ${config.PORT}`));
