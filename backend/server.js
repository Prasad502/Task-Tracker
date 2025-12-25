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
  cookie: { httpOnly: true, sameSite: 'lax' }
}));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/sprints", sprintRoutes);
app.use("/people", peopleRoutes);

app.get('/', (_, res) =>
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173')
);

app.listen(config.PORT, () => console.log(`Backend running on ${config.PORT}`));
