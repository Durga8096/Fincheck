const express = require('express');
const { readJSON, writeJSON } = require('../fileUtils');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

const BUDGETS_FILE = 'budgets.json';

router.get('/', authMiddleware, async (req, res) => {
  const budgets = await readJSON(BUDGETS_FILE);
  res.json(budgets.filter((b) => b.userId === req.user.id));
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, limit, icon, color, alertThreshold } = req.body;
    if (!name || !limit)
      return res.status(400).json({ error: 'Missing fields' });

    const budgets = await readJSON(BUDGETS_FILE);
    const budget = {
      id: Date.now().toString(),
      userId: req.user.id,
      name,
      limit,
      icon: icon || '📊',
      color: color || '#FF6B6B',
      alertThreshold: alertThreshold || 80
    };
    budgets.push(budget);
    await writeJSON(BUDGETS_FILE, budgets);
    res.status(201).json(budget);
  } catch (err) {
    console.error('Add budget error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, limit, icon, color, alertThreshold } = req.body;
  const budgets = await readJSON(BUDGETS_FILE);
  const budget = budgets.find((b) => b.id === id && b.userId === req.user.id);
  if (!budget) return res.status(404).json({ error: 'Budget not found' });

  if (name) budget.name = name;
  if (limit !== undefined) budget.limit = limit;
  if (icon) budget.icon = icon;
  if (color) budget.color = color;
  if (alertThreshold !== undefined) budget.alertThreshold = alertThreshold;

  await writeJSON(BUDGETS_FILE, budgets);
  res.json(budget);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  let budgets = await readJSON(BUDGETS_FILE);
  const initialLength = budgets.length;
  budgets = budgets.filter((b) => !(b.id === id && b.userId === req.user.id));
  if (budgets.length === initialLength)
    return res.status(404).json({ error: 'Budget not found' });

  await writeJSON(BUDGETS_FILE, budgets);
  res.json({ success: true });
});

module.exports = router; 