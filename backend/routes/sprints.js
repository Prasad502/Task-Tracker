const express = require("express");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const { SPRINT_FILE } = require("../config");

const router = express.Router();

const read = () => JSON.parse(fs.readFileSync(SPRINT_FILE));
const write = data => fs.writeFileSync(SPRINT_FILE, JSON.stringify(data, null, 2));

router.get("/", (_, res) => res.json(read()));

router.post("/", (req, res) => {
  const sprints = read();
  const sprint = { id: uuid(), ...req.body };
  sprints.push(sprint);
  write(sprints);
  res.status(201).json(sprint);
});

router.delete("/:id", (req, res) => {
  write(read().filter(s => s.id !== req.params.id));
  res.sendStatus(204);
});

module.exports = router;
