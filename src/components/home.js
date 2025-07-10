import React, { useEffect, useState } from 'react';
import {
  apiGetTransactions,
  apiGetBudgets
} from '../api';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PiggyBank,
  Plus,
  Minus,
  Calendar,
  Target
} from 'lucide-react';

// Utility for INR formatting
const formatINR = (amount) => {
  return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
};

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionCategory, setTransactionCategory] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const txs = await apiGetTransactions(token);
        setTransactions(txs);
        const bgs = await apiGetBudgets(token);
        setBudgets(bgs);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Calculate financial data from transactions
  const currentBalance = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
  const monthlyIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const monthlyExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const savings = Math.max(currentBalance - monthlyExpenses, 0);
  const budget = budgets.reduce((sum, b) => sum + b.limit, 0) || 20000;

  const handleAddTransaction = (e) => {
    e.preventDefault();
    // For demo: just close modal, in real app, use API and update state
    setShowAddTransaction(false);
    setTransactionAmount('');
    setTransactionCategory('');
    setTransactionDescription('');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Groceries': '🛒',
      'Salary': '💰',
      'Utilities': '⚡',
      'Entertainment': '🎬',
      'Freelance': '💼',
      'Transport': '🚗',
      'Healthcare': '🏥',
      'Shopping': '🛍️'
    };
    return icons[category] || '📊';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome back, User!</h2>
          <p className="text-gray-600">Here's your financial overview</p>
        </div>
        {/* Removed Add Transaction button */}
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Balance */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Current Balance</p>
              <p className="text-3xl font-bold">{formatINR(currentBalance)}</p>
            </div>
            <DollarSign size={32} className="text-blue-200" />
          </div>
        </div>

        {/* Monthly Income */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Monthly Income</p>
              <p className="text-3xl font-bold">{formatINR(monthlyIncome)}</p>
            </div>
            <TrendingUp size={32} className="text-green-200" />
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Monthly Expenses</p>
              <p className="text-3xl font-bold">{formatINR(monthlyExpenses)}</p>
            </div>
            <TrendingDown size={32} className="text-red-200" />
          </div>
        </div>

        {/* Savings */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Savings</p>
              <p className="text-3xl font-bold">{formatINR(savings)}</p>
            </div>
            <PiggyBank size={32} className="text-purple-200" />
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Budget Progress</h3>
          <Target size={20} className="text-gray-600" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Monthly Budget</span>
            <span className="font-semibold">{formatINR(budget)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(monthlyExpenses / budget) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Spent: {formatINR(monthlyExpenses)}</span>
            <span>Remaining: {formatINR(budget - monthlyExpenses)}</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {loading ? <div>Loading...</div> : transactions.slice(0, 5).map((transaction) => (
            <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryIcon(transaction.category)}</span>
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatINR(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <CreditCard size={24} className="text-blue-600" />
          <div className="text-left">
            <p className="font-semibold text-gray-800">Add Expense</p>
            <p className="text-sm text-gray-600">Record a new expense</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <TrendingUp size={24} className="text-green-600" />
          <div className="text-left">
            <p className="font-semibold text-gray-800">Add Income</p>
            <p className="text-sm text-gray-600">Record new income</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <Calendar size={24} className="text-purple-600" />
          <div className="text-left">
            <p className="font-semibold text-gray-800">Set Budget</p>
            <p className="text-sm text-gray-600">Configure budget limits</p>
          </div>
        </button>
      </div>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add Transaction</h3>
              <button 
                onClick={() => setShowAddTransaction(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTransactionType('expense')}
                  className={`flex-1 p-2 rounded-lg border ${
                    transactionType === 'expense' 
                      ? 'bg-red-100 border-red-300 text-red-700' 
                      : 'border-gray-300'
                  }`}
                >
                  <Minus size={16} className="inline mr-1" />
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('income')}
                  className={`flex-1 p-2 rounded-lg border ${
                    transactionType === 'income' 
                      ? 'bg-green-100 border-green-300 text-green-700' 
                      : 'border-gray-300'
                  }`}
                >
                  <Plus size={16} className="inline mr-1" />
                  Income
                </button>
              </div>
              <input
                type="number"
                placeholder="Amount (₹)"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <select
                value={transactionCategory}
                onChange={(e) => setTransactionCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Category</option>
                <option value="Groceries">Groceries</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transport">Transport</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Shopping">Shopping</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                value={transactionDescription}
                onChange={(e) => setTransactionDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTransaction(false)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
