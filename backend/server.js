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

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

const isProd = process.env.NODE_ENV === 'production';
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  // for cross-site requests (frontend on different origin) we need sameSite: 'none' and secure in production
  cookie: { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd }
}));

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/tasks", taskRoutes);
app.use("/sprints", sprintRoutes);
app.use("/people", peopleRoutes);

app.get('/', (_, res) =>
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173')
);

app.listen(config.PORT, () => console.log(`Backend running on ${config.PORT}`));
