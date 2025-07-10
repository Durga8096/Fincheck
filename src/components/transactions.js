import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Download,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';
import {
  apiGetTransactions,
  apiAddTransaction,
  apiUpdateTransaction,
  apiDeleteTransaction
} from '../api';

// Utility for INR formatting
const formatINR = (amount) => {
  return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
};

const LOCAL_STORAGE_KEY = 'fitcheck_transactions';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionCategory, setTransactionCategory] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionLocation, setTransactionLocation] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const txs = await apiGetTransactions(token);
      setTransactions(txs);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const categories = [
    'Groceries', 'Salary', 'Utilities', 'Entertainment', 'Freelance', 
    'Transport', 'Healthcare', 'Shopping', 'Dining', 'Education'
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      'Groceries': '🛒',
      'Salary': '💰',
      'Utilities': '⚡',
      'Entertainment': '🎬',
      'Freelance': '💼',
      'Transport': '🚗',
      'Healthcare': '🏥',
      'Shopping': '🛍️',
      'Dining': '🍽️',
      'Education': '📚'
    };
    return icons[category] || '📊';
  };

  const getTypeColor = (type) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getTypeIcon = (type) => {
    return type === 'income' ? '↗️' : '↘️';
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    console.log('Submitting transaction'); // DEBUG LOG
    setError('');
    try {
      const token = localStorage.getItem('token');
      const newTransaction = {
        type: transactionType,
        amount: parseFloat(transactionAmount),
        category: transactionCategory,
        description: transactionDescription,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location: transactionLocation,
        tags: []
      };
      await apiAddTransaction(newTransaction, token);
      setShowAddTransaction(false);
      setTransactionAmount('');
      setTransactionCategory('');
      setTransactionDescription('');
      setTransactionLocation('');
      fetchTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      await apiDeleteTransaction(id, token);
      fetchTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingId(transaction.id);
    setEditData({ ...transaction });
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await apiUpdateTransaction(editingId, editData, token);
      setEditingId(null);
      setEditData({});
      fetchTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const desc = transaction.description || '';
      const cat = transaction.category || '';
      const matchesSearch =
        desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || cat === selectedCategory;
      const matchesType = selectedType === 'all' || transaction.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          return 0;
      }
    });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Transactions</h2>
          <p className="text-gray-600">Manage and track your financial transactions</p>
        </div>
        <button
          onClick={() => setShowAddTransaction(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Income</p>
              <p className="text-3xl font-bold">{formatINR(totalIncome)}</p>
            </div>
            <DollarSign size={32} className="text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold">{formatINR(totalExpenses)}</p>
            </div>
            <DollarSign size={32} className="text-red-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Net Amount</p>
              <p className="text-3xl font-bold">{formatINR(netAmount)}</p>
            </div>
            <DollarSign size={32} className="text-blue-200" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Transactions ({filteredTransactions.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(transaction.category)}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{transaction.location}</span>
                        <span>•</span>
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <span>{transaction.time}</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {transaction.tags && transaction.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-bold text-lg ${getTypeColor(transaction.type)}`}>
                      {getTypeIcon(transaction.type)} {formatINR(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-600">{transaction.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" onClick={() => handleDeleteTransaction(transaction.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Export Transactions</h3>
            <p className="text-gray-600">Download your transaction data in various formats</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download size={16} />
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>
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
                <button type="button" onClick={() => setTransactionType('expense')} className={`flex-1 p-2 rounded-lg border ${transactionType === 'expense' ? 'bg-red-100 border-red-300 text-red-700' : 'border-gray-300'}`}>Expense</button>
                <button type="button" onClick={() => setTransactionType('income')} className={`flex-1 p-2 rounded-lg border ${transactionType === 'income' ? 'bg-green-100 border-green-300 text-green-700' : 'border-gray-300'}`}>Income</button>
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
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={transactionDescription}
                onChange={(e) => setTransactionDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Location (optional)"
                value={transactionLocation}
                onChange={(e) => setTransactionLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
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

export default Transactions; 