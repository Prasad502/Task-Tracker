const express = require('express');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const { CHAT_FILE, PEOPLE_FILE } = require('../config');

const router = express.Router();

const read = () => JSON.parse(fs.readFileSync(CHAT_FILE));
const write = (data) => fs.writeFileSync(CHAT_FILE, JSON.stringify(data, null, 2));

// In-memory list of SSE clients (for simple push updates)
let clients = [];

// Return all messages
router.get('/', (req, res) => {
  res.json(read());
});

// Post a new chat message (requires authenticated session)
router.post('/messages', (req, res) => {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'not authenticated' });

  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'message text required' });

  const people = JSON.parse(fs.readFileSync(PEOPLE_FILE));
  const user = people.find(p => p.id === userId);

  const message = {
    id: uuid(),
    userId,
    name: user ? user.name : 'Unknown',
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  const messages = read();
  messages.push(message);
  write(messages);

  // Broadcast to SSE clients
  clients.forEach(c => {
    try {
      c.res.write(`data: ${JSON.stringify(message)}\n\n`);
    } catch (e) {
      // ignore
    }
  });

  res.status(201).json(message);
});

// SSE endpoint for real-time updates (requires authenticated session)
router.get('/events', (req, res) => {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'not authenticated' });

  // Set SSE headers
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.flushHeaders && res.flushHeaders();

  // Keep the connection open
  const client = { id: uuid(), res };
  clients.push(client);

  // Remove client when connection closes
  req.on('close', () => {
    clients = clients.filter(c => c.id !== client.id);
  });
});

module.exports = router;
