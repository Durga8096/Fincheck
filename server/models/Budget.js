const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  limit: { type: Number, required: true },
  icon: { type: String, default: '📊' },
  color: { type: String, default: '#FF6B6B' },
  alertThreshold: { type: Number, default: 80 },
});

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget; 