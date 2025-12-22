const fs = require("fs");
const path = require("path");

const SPRINT_FILE = path.join(__dirname, "../data/sprints.json");

function getSprintForDate(date = new Date()) {
  const epoch = new Date("2025-01-01");
  const diffDays = Math.floor((date - epoch) / (1000 * 60 * 60 * 24));
  const sprintIndex = Math.floor(diffDays / 14);

  const start = new Date(epoch);
  start.setDate(epoch.getDate() + sprintIndex * 14);

  const end = new Date(start);
  end.setDate(start.getDate() + 13);

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
