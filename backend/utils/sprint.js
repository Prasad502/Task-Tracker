const fs = require("fs");
const path = require("path");
const { SPRINT_FILE } = require("../config");

const SPRINT_EPOCH = process.env.SPRINT_EPOCH || '2025-01-01';
const SPRINT_LENGTH = process.env.SPRINT_LENGTH ? Number(process.env.SPRINT_LENGTH) : 14;

function getSprintForDate(date = new Date()) {
  const epoch = new Date(SPRINT_EPOCH);
  const diffDays = Math.floor((date - epoch) / (1000 * 60 * 60 * 24));
  const sprintIndex = Math.floor(diffDays / SPRINT_LENGTH);

  const start = new Date(epoch);
  start.setDate(epoch.getDate() + sprintIndex * SPRINT_LENGTH);

  const end = new Date(start);
  end.setDate(start.getDate() + SPRINT_LENGTH - 1);

  const sprint = {
    id: `${start.toISOString().slice(0,10)}_to_${end.toISOString().slice(0,10)}`,
    startDate: start.toISOString().slice(0,10),
    endDate: end.toISOString().slice(0,10)
  };

  let sprints = JSON.parse(fs.readFileSync(SPRINT_FILE));
  if (!sprints.find(s => s.id === sprint.id)) {
    sprints.push(sprint);
    fs.writeFileSync(SPRINT_FILE, JSON.stringify(sprints, null, 2));
  }

  return sprint;
}

module.exports = { getSprintForDate };
