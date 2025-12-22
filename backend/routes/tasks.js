const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { getSprintForDate } = require("../utils/sprint");

const router = express.Router();
const TASK_FILE = path.join(__dirname, "../data/tasks.json");

const read = () => JSON.parse(fs.readFileSync(TASK_FILE));
const write = data => fs.writeFileSync(TASK_FILE, JSON.stringify(data, null, 2));

router.get("/", (req, res) => {
  let tasks = read();
  if (req.query.sprintId)
    tasks = tasks.filter(t => t.sprintId === req.query.sprintId);
  res.json(tasks);
});

router.post("/", (req, res) => {
  const tasks = read();
  const task = {
    id: uuid(),
    title: req.body.title,
    description: req.body.description,
    effort: req.body.effort,
    status: "New",
    assignee: req.body.assignee || null,
    sprintId: req.body.sprintId,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  write(tasks);
  res.status(201).json(task);
});

router.put("/:id", (req, res) => {
  const tasks = read();
  const i = tasks.findIndex(t => t.id === req.params.id);
  tasks[i] = { ...tasks[i], ...req.body };
  write(tasks);
  res.json(tasks[i]);
});

router.delete("/:id", (req, res) => {
  write(read().filter(t => t.id !== req.params.id));
  res.sendStatus(204);
});

router.get("/summary/:sprintId", (req, res) => {
  const tasks = read().filter(t => t.sprintId === req.params.sprintId);
  const summary = {};
  tasks.forEach(t => {
    summary[t.assignee] = (summary[t.assignee] || 0) + t.effort;
  });
  res.json(summary);
});

module.exports = router;
