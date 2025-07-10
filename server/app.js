const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const transactionsRoutes = require('./routes/transactions');
const budgetsRoutes = require('./routes/budgets');

const app = express();


app.use(cors());

app.use(bodyParser.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/budgets', budgetsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Express server listening at http://localhost:${PORT}`);
});

module.exports = app;