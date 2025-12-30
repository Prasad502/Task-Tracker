const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { PEOPLE_FILE } = require('../config');

const router = express.Router();

const read = file => JSON.parse(fs.readFileSync(file));
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// login (or auto-register if username not found)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const people = read(PEOPLE_FILE);
  // Case-sensitive lookup: do NOT normalize username
  const person = people.find(p => p.username === username);

  // Do not auto-register here; reject unknown usernames
  if (!person) return res.status(401).json({ error: 'invalid credentials' });

  // verify password
  if (!person.passwordHash || !bcrypt.compareSync(password, person.passwordHash)) {
    return res.status(401).json({ error: 'invalid credentials' });
  }

  // create session
  req.session.userId = person.id;

  const { passwordHash, ...safe } = person;
  res.json(safe);
});

// Explicit registration endpoint
router.post('/register', (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const people = read(PEOPLE_FILE);
  // Enforce case-sensitive uniqueness
  if (people.find(p => p.username === username)) {
    return res.status(409).json({ error: 'username already exists' });
  }

  const person = {
    id: uuid(),
    name: name || username,
    username,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString()
  };

  people.push(person);
  write(PEOPLE_FILE, people);

  // create session
  req.session.userId = person.id;

  const { passwordHash, ...safe } = person;
  res.status(201).json(safe);
});

router.post('/logout', (req, res) => {
  req.session && req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'failed to destroy session' });
    res.sendStatus(204);
  });
});

router.get('/me', (req, res) => {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'not authenticated' });
  const people = read(PEOPLE_FILE);
  const person = people.find(p => p.id === userId);
  if (!person) return res.status(401).json({ error: 'invalid session' });
  const { passwordHash, ...safe } = person;
  res.json(safe);
});

module.exports = router;
