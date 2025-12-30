require('dotenv').config();
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const taskRoutes = require("./routes/tasks");
const sprintRoutes = require("./routes/sprints");
const peopleRoutes = require("./routes/people");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const config = require('./config');

const app = express();
// when running behind a proxy (like Render) we need to trust the proxy so secure cookies work
app.set('trust proxy', 1);

// support a single FRONTEND_URL or a comma-separated FRONTEND_URLS env var for multiple deployed frontends
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'https://task-tracker-frontend-gyle.onrender.com')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

console.log('Allowed CORS origins:', allowedOrigins.join(', '));

app.use(cors({
  origin: function(origin, callback) {
    // allow server-to-server or tools that omit origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  credentials: true
}));

app.use(express.json());

const isProd = process.env.NODE_ENV === 'production';
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  // Refresh cookie expiry on each response so active users stay logged in
  rolling: true,
  // for cross-site requests (frontend on different origin) we need sameSite: 'none' and secure in production
  cookie: {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax', secure: isProd,
    // default to 7 days (in ms); override with SESSION_MAX_AGE env var
    maxAge: process.env.SESSION_MAX_AGE ? Number(process.env.SESSION_MAX_AGE) : 7 * 24 * 60 * 60 * 1000,
    // set secure cookies in production (requires HTTPS)
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/tasks", taskRoutes);
app.use("/sprints", sprintRoutes);
app.use("/people", peopleRoutes);

app.listen(config.PORT, () => console.log(`Backend running on ${config.PORT}`));
