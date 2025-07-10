const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: String },
  time: { type: String },
  location: { type: String },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema); 