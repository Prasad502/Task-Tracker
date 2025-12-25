const express = require("express");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const { PEOPLE_FILE, TASK_FILE } = require("../config");

const router = express.Router();

const read = file => JSON.parse(fs.readFileSync(file));
const write = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

router.get("/", (_, res) => {
  const people = read(PEOPLE_FILE).map(({ passwordHash, ...rest }) => rest);
  res.json(people);
});

router.post("/", (req, res) => {
  const people = read(PEOPLE_FILE);
  const person = { id: uuid(), name: req.body.name };
  people.push(person);
  write(PEOPLE_FILE, people);
  res.status(201).json(person);
});

/**
 * Remove person → unassign their tasks
 */
router.delete("/:id", (req, res) => {
  const people = read(PEOPLE_FILE).filter(p => p.id !== req.params.id);
  write(PEOPLE_FILE, people);

  const tasks = read(TASK_FILE).map(t =>
    t.assignee === req.params.id ? { ...t, assignee: null } : t
  );
  write(TASK_FILE, tasks);

  res.sendStatus(204);
});

module.exports = router;
