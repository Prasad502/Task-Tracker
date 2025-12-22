const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const router = express.Router();
const FILE = path.join(__dirname, "../data/sprints.json");

const read = () => JSON.parse(fs.readFileSync(FILE));
const write = data => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

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
