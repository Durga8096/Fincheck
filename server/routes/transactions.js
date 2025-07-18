const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get all transactions for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions.map(t => ({
      id: t._id.toString(),
      userId: t.userId,
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: t.date,
      note: t.note,
      budgetId: t.budgetId
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create transaction
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, type, category, date, note, budgetId } = req.body;
    if (!amount || !type || !category || !date)
      return res.status(400).json({ error: 'Missing fields' });
    const transaction = new Transaction({
      userId: req.user.id,
      amount,
      type,
      category,
      date,
      note: note || '',
      budgetId: budgetId || null
    });
    await transaction.save();
    res.status(201).json({
      id: transaction._id.toString(),
      userId: transaction.userId,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      note: transaction.note,
      budgetId: transaction.budgetId
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update transaction
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, date, note, budgetId } = req.body;
    const transaction = await Transaction.findOne({ _id: id, userId: req.user.id });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    if (amount !== undefined) transaction.amount = amount;
    if (type !== undefined) transaction.type = type;
    if (category !== undefined) transaction.category = category;
    if (date !== undefined) transaction.date = date;
    if (note !== undefined) transaction.note = note;
    if (budgetId !== undefined) transaction.budgetId = budgetId;
    await transaction.save();
    res.json({
      id: transaction._id.toString(),
      userId: transaction.userId,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      note: transaction.note,
      budgetId: transaction.budgetId
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Transaction.deleteOne({ _id: id, userId: req.user.id });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Transaction not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 