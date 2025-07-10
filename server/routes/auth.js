const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readJSON, writeJSON } = require('../fileUtils');
const { JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

const USERS_FILE = 'users.json';

router.post('/register', async (req, res) => {
  try {
    console.log('Register endpoint hit', req.body);
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ message: 'Missing fields' });

    const users = await readJSON(USERS_FILE);
    if (users.find((u) => u.email === email))
      return res.status(409).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      email,
      password: hashed,
      name,
      avatar: '',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    await writeJSON(USERS_FILE, users);

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await readJSON(USERS_FILE);
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } });
});

module.exports = router; 