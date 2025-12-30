const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const DATA_DIR = process.env.DATA_DIR ? process.env.DATA_DIR : path.join(__dirname, 'data');

const TASK_FILE = path.join(DATA_DIR, 'tasks.json');
const SPRINT_FILE = path.join(DATA_DIR, 'sprints.json');
const PEOPLE_FILE = path.join(DATA_DIR, 'people.json');
const CHAT_FILE = path.join(DATA_DIR, 'messages.json');

module.exports = { PORT, DATA_DIR, TASK_FILE, SPRINT_FILE, PEOPLE_FILE, CHAT_FILE };
