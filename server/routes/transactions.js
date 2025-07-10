const express = require('express');
const { readJSON, writeJSON } = require('../fileUtils');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

const TRANSACTIONS_FILE = 'transactions.json';

router.get('/', authMiddleware, async (req, res) => {
  const transactions = await readJSON(TRANSACTIONS_FILE);
  res.json(transactions.filter((t) => t.userId === req.user.id));
});

router.post('/', authMiddleware, async (req, res) => {
  const { amount, type, category, date, note } = req.body;
  if (!amount || !type || !category || !date)
    return res.status(400).json({ error: 'Missing fields' });

  const transactions = await readJSON(TRANSACTIONS_FILE);
  const transaction = {
    id: Date.now().toString(),
    userId: req.user.id,
    amount,
    type,
    category,
    date,
    note: note || '',
  };
  transactions.push(transaction);
  await writeJSON(TRANSACTIONS_FILE, transactions);
  res.status(201).json(transaction);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { amount, type, category, date, note } = req.body;
  const transactions = await readJSON(TRANSACTIONS_FILE);
  const transaction = transactions.find((t) => t.id === id && t.userId === req.user.id);
  if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

  if (amount !== undefined) transaction.amount = amount;
  if (type) transaction.type = type;
  if (category) transaction.category = category;
  if (date) transaction.date = date;
  if (note !== undefined) transaction.note = note;

  await writeJSON(TRANSACTIONS_FILE, transactions);
  res.json(transaction);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  let transactions = await readJSON(TRANSACTIONS_FILE);
  const initialLength = transactions.length;
  transactions = transactions.filter((t) => !(t.id === id && t.userId === req.user.id));
  if (transactions.length === initialLength)
    return res.status(404).json({ error: 'Transaction not found' });

  await writeJSON(TRANSACTIONS_FILE, transactions);
  res.json({ success: true });
});

module.exports = router; 