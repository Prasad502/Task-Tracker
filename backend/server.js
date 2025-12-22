require('dotenv').config();
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");
const sprintRoutes = require("./routes/sprints");
const peopleRoutes = require("./routes/people");
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/sprints", sprintRoutes);
app.use("/people", peopleRoutes);

app.listen(config.PORT, () => console.log(`Backend running on ${config.PORT}`));
