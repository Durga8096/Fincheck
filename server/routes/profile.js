const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id.toString(), email: user.email, name: user.name, avatar: user.avatar, phone: user.phone, location: user.location });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, avatar, phone, location } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (avatar !== undefined) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    await user.save();
    res.json({ id: user._id.toString(), email: user.email, name: user.name, avatar: user.avatar, phone: user.phone, location: user.location });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update avatar
router.post('/avatar', authMiddleware, async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.avatar = avatar;
    await user.save();
    res.json({ avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 