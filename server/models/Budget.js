const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  limit: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  color: { type: String, default: '#FF6B6B' },
  icon: { type: String, default: '📊' },
  alertThreshold: { type: Number, default: 80 },
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema); 