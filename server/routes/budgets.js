const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Budget = require('../models/Budget');
const router = express.Router();

// Get all budgets for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.json(budgets.map(b => ({
      id: b._id.toString(),
      userId: b.userId,
      name: b.name,
      limit: b.limit,
      icon: b.icon,
      color: b.color,
      alertThreshold: b.alertThreshold
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create budget
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, limit, icon, color, alertThreshold } = req.body;
    if (!name || !limit)
      return res.status(400).json({ error: 'Missing fields' });
    const budget = new Budget({
      userId: req.user.id,
      name,
      limit,
      icon: icon || '📊',
      color: color || '#FF6B6B',
      alertThreshold: alertThreshold || 80
    });
    await budget.save();
    res.status(201).json({
      id: budget._id.toString(),
      userId: budget.userId,
      name: budget.name,
      limit: budget.limit,
      icon: budget.icon,
      color: budget.color,
      alertThreshold: budget.alertThreshold
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update budget
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, limit, icon, color, alertThreshold } = req.body;
    const budget = await Budget.findOne({ _id: id, userId: req.user.id });
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    if (name !== undefined) budget.name = name;
    if (limit !== undefined) budget.limit = limit;
    if (icon !== undefined) budget.icon = icon;
    if (color !== undefined) budget.color = color;
    if (alertThreshold !== undefined) budget.alertThreshold = alertThreshold;
    await budget.save();
    res.json({
      id: budget._id.toString(),
      userId: budget.userId,
      name: budget.name,
      limit: budget.limit,
      icon: budget.icon,
      color: budget.color,
      alertThreshold: budget.alertThreshold
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete budget
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Budget.deleteOne({ _id: id, userId: req.user.id });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Budget not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 