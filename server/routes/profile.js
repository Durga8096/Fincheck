const express = require('express');
const { readJSON, writeJSON } = require('../fileUtils');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

const USERS_FILE = 'users.json';

router.get('/', authMiddleware, async (req, res) => {
  const users = await readJSON(USERS_FILE);
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, name: user.name, avatar: user.avatar });
});

router.put('/', authMiddleware, async (req, res) => {
  const { name, email, avatar, phone, location } = req.body;
  const users = await readJSON(USERS_FILE);
  console.log('Decoded user id:', req.user.id);
  console.log('Users in file:', users);
  console.log('Request body:', req.body);
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (avatar !== undefined) user.avatar = avatar;
  if (phone !== undefined) user.phone = phone;
  if (location !== undefined) user.location = location;

  await writeJSON(USERS_FILE, users);
  res.json({ id: user.id, email: user.email, name: user.name, avatar: user.avatar, phone: user.phone, location: user.location });
});

router.post('/avatar', authMiddleware, async (req, res) => {
  const { avatar } = req.body; // base64 string
  const users = await readJSON(USERS_FILE);
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.avatar = avatar;
  await writeJSON(USERS_FILE, users);
  res.json({ avatar: user.avatar });
});

module.exports = router; 