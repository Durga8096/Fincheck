const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true }, // income or expense
  category: { type: String, required: true },
  date: { type: Date, required: true },
  note: { type: String, default: '' },
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: false },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction; 