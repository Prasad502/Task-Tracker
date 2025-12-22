const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const router = express.Router();
const PEOPLE = path.join(__dirname, "../data/people.json");
const TASKS = path.join(__dirname, "../data/tasks.json");

const read = file => JSON.parse(fs.readFileSync(file));
const write = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

router.get("/", (_, res) => {
  res.json(read(PEOPLE));
});

router.post("/", (req, res) => {
  const people = read(PEOPLE);
  const person = { id: uuid(), name: req.body.name };
  people.push(person);
  write(PEOPLE, people);
  res.status(201).json(person);
});

/**
 * Remove person → unassign their tasks
 */
router.delete("/:id", (req, res) => {
  const people = read(PEOPLE).filter(p => p.id !== req.params.id);
  write(PEOPLE, people);

  const tasks = read(TASKS).map(t =>
    t.assignee === req.params.id ? { ...t, assignee: null } : t
  );
  write(TASKS, tasks);

  res.sendStatus(204);
});

module.exports = router;
