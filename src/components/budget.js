import React, { useEffect, useState } from 'react';
import {
  apiGetBudgets,
  apiAddBudget,
  apiUpdateBudget,
  apiDeleteBudget,
  apiGetTransactions,
  apiAddTransaction,
  apiUpdateTransaction,
  apiDeleteTransaction
} from '../api';
import {
  Target,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit3,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar
} from 'lucide-react';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({
    name: '',
    limit: '',
    color: '#FF6B6B',
    icon: '📊',
    alertThreshold: 80
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');

  // Add state and modal for adjusting spent
  // Remove Adjust Spent state and modal
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState(null);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [expenseError, setExpenseError] = useState('');

  const [showEditExpense, setShowEditExpense] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [editExpenseAmount, setEditExpenseAmount] = useState('');
  const [editExpenseDescription, setEditExpenseDescription] = useState('');
  const [editExpenseDate, setEditExpenseDate] = useState('');
  const [editExpenseError, setEditExpenseError] = useState('');

  useEffect(() => {
    fetchBudgetsAndTransactions();
  }, []);

  const fetchBudgetsAndTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const [budgetsData, transactionsData] = await Promise.all([
        apiGetBudgets(token),
        apiGetTransactions(token)
      ]);
      setBudgets(budgetsData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // For each budget, compute spent from transactions
  const budgetsWithSpent = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.name)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...budget, spent };
  });

  const handleAddBudget = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const budget = await apiAddBudget({
        ...newBudget,
        limit: parseFloat(newBudget.limit)
      }, token);
      setShowAddBudget(false);
      setNewBudget({ name: '', limit: '', color: '#FF6B6B', icon: '📊', alertThreshold: 80 });
      fetchBudgetsAndTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBudget = async (id) => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      await apiDeleteBudget(id, token);
      fetchBudgetsAndTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditBudget = (budget) => {
    setEditingId(budget.id);
    setEditData({ ...budget });
  };

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await apiUpdateBudget(editingId, editData, token);
      setEditingId(null);
      setEditData({});
      fetchBudgetsAndTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenAddExpense = (category) => {
    setExpenseCategory(category);
    setExpenseAmount('');
    setExpenseDescription('');
    setExpenseDate(new Date().toISOString().slice(0, 10));
    setExpenseError('');
    setShowAddExpense(true);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setExpenseError('');
    try {
      const token = localStorage.getItem('token');
      await apiAddTransaction({
        type: 'expense',
        amount: parseFloat(expenseAmount),
        category: expenseCategory.name,
        description: expenseDescription,
        date: expenseDate,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location: '',
        tags: []
      }, token);
      setShowAddExpense(false);
      fetchBudgetsAndTransactions();
    } catch (err) {
      setExpenseError(err.message);
    }
  };

  const handleOpenEditExpense = (expense) => {
    setEditExpense(expense);
    setEditExpenseAmount(expense.amount);
    setEditExpenseDescription(expense.description);
    setEditExpenseDate(expense.date);
    setEditExpenseError('');
    setShowEditExpense(true);
  };

  const handleEditExpense = async (e) => {
    e.preventDefault();
    setEditExpenseError('');
    try {
      const token = localStorage.getItem('token');
      await apiUpdateTransaction(editExpense.id, {
        ...editExpense,
        amount: parseFloat(editExpenseAmount),
        description: editExpenseDescription,
        date: editExpenseDate
      }, token);
      setShowEditExpense(false);
      fetchBudgetsAndTransactions();
    } catch (err) {
      setEditExpenseError(err.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await apiDeleteTransaction(id, token);
      fetchBudgetsAndTransactions();
    } catch (err) {
      alert('Failed to delete expense: ' + err.message);
    }
  };

  const getProgressPercentage = (spent, limit) => Math.min((spent / limit) * 100, 100);
  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 90) return 'bg-orange-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  const getStatusIcon = (category) => {
    const percentage = (category.spent / category.limit) * 100;
    if (percentage >= 100) return <AlertTriangle size={20} className="text-red-500" />;
    if (percentage >= category.alertThreshold) return <AlertTriangle size={20} className="text-orange-500" />;
    return <CheckCircle size={20} className="text-green-500" />;
  };
  const icons = ['🍽️', '🚗', '🎬', '⚡', '🛍️', '🏥', '📚', '💼', '🏠', '✈️', '🎮', '💄'];

  // Use budgetsWithSpent for all calculations and UI
  const totalBudget = budgetsWithSpent.reduce((sum, cat) => sum + cat.limit, 0);
  const totalSpent = budgetsWithSpent.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallProgress = (totalSpent / totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Budget Management</h2>
          <p className="text-gray-600">Track your spending against budget limits</p>
        </div>
        <button
          onClick={() => setShowAddBudget(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          type="button"
        >
          <Plus size={20} />
          Add Budget Category
        </button>
      </div>

      {/* Overall Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Budget</p>
              <p className="text-3xl font-bold">₹{totalBudget.toLocaleString('en-IN')}</p>
            </div>
            <Target size={32} className="text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Spent</p>
              <p className="text-3xl font-bold">₹{totalSpent.toLocaleString('en-IN')}</p>
            </div>
            <DollarSign size={32} className="text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Remaining</p>
              <p className="text-3xl font-bold">₹{totalRemaining.toLocaleString('en-IN')}</p>
            </div>
            <DollarSign size={32} className="text-purple-200" />
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Overall Budget Progress</h3>
          <span className="text-sm text-gray-600">{overallProgress.toFixed(1)}% Used</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full transition-all duration-300 ${getProgressColor(overallProgress)}`}
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Budget Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? <div>Loading...</div> : budgetsWithSpent.map((category) => {
            const percentage = (category.spent / category.limit) * 100;
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage >= category.alertThreshold;
            
            const categoryExpenses = transactions
              .filter(t => t.type === 'expense' && t.category === category.name)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5);

            return (
              <div key={category.id} className={`p-4 border-2 rounded-lg ${
                isOverBudget ? 'border-red-300 bg-red-50' :
                isNearLimit ? 'border-orange-300 bg-orange-50' :
                'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{category.name}</h4>
                      <p className="text-sm text-gray-600">Alert at {category.alertThreshold}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(category)}
                    <button
                      onClick={() => handleEditBudget(category)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit Budget"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(category._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    {/* Remove Adjust Spent button */}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spent</span>
                    <span className="font-semibold">₹{category.spent.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Limit</span>
                    <span className="font-semibold">₹{category.limit.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className={`font-semibold ${
                      category.limit - category.spent < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ₹{(category.limit - category.spent).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{percentage.toFixed(1)}%</span>
                    <span>{isOverBudget ? 'Over Budget!' : 'Used'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenAddExpense(category)}
                  className="text-gray-400 hover:text-green-600 transition-colors mt-2"
                  title="Add Expense"
                  type="button"
                >
                  Add Expense
                </button>
                {/* Recent Expenses */}
                <div className="mt-4">
                  <h5 className="font-semibold text-gray-700 mb-2">Recent Expenses</h5>
                  {categoryExpenses.length === 0 && <div className="text-gray-400 text-sm">No expenses yet.</div>}
                  {categoryExpenses.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                      <div>
                        <div className="font-medium text-gray-800">₹{expense.amount}</div>
                        <div className="text-xs text-gray-500">{expense.description} • {expense.date}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEditExpense(expense)}
                          className="text-blue-500 hover:text-blue-700 text-xs"
                          title="Edit"
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                          title="Delete"
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Alerts */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={24} className="text-orange-600" />
          <h3 className="text-xl font-semibold text-gray-800">Budget Alerts</h3>
        </div>
        <div className="space-y-3">
          {budgetsWithSpent.filter(cat => (cat.spent / cat.limit) * 100 >= cat.alertThreshold).map(category => {
            const percentage = (category.spent / category.limit) * 100;
            return (
              <div key={category._id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{category.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{category.name}</p>
                    <p className="text-sm text-gray-600">
                      {percentage >= 100 ? 'Over budget!' : 'Approaching limit'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    ₹{category.spent} / ₹{category.limit}
                  </p>
                  <p className="text-sm text-orange-600">{percentage.toFixed(1)}% used</p>
                </div>
              </div>
            );
          })}
          {budgetsWithSpent.filter(cat => (cat.spent / cat.limit) * 100 >= cat.alertThreshold).length === 0 && (
            <p className="text-gray-500 text-center py-4">No budget alerts at this time</p>
          )}
        </div>
      </div>

      {/* Add Budget Modal */}
      {showAddBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add Budget Category</h3>
              <button 
                onClick={() => setShowAddBudget(false)}
                className="text-gray-500 hover:text-gray-700"
                type="button"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddBudget} className="space-y-4">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g., Food & Dining"
                  value={newBudget.name}
                  onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Limit</label>
                <input
                  type="number"
                  placeholder="500"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {icons.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setNewBudget({ ...newBudget, icon })}
                      className={`p-2 text-xl rounded-lg border-2 ${
                        newBudget.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alert Threshold (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={newBudget.alertThreshold}
                  onChange={(e) => setNewBudget({ ...newBudget, alertThreshold: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="color"
                  value={newBudget.color}
                  onChange={(e) => setNewBudget({ ...newBudget, color: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg h-12"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBudget(false)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Budget Category</h3>
              <button 
                onClick={() => { setEditingId(null); setEditData({}); }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Limit</label>
                <input
                  type="number"
                  value={editData.limit || ''}
                  onChange={(e) => setEditData({ ...editData, limit: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {icons.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setEditData({ ...editData, icon })}
                      className={`p-2 text-xl rounded-lg border-2 ${
                        editData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alert Threshold (%)</label>
                <input
                  type="number"
                  value={editData.alertThreshold || ''}
                  onChange={(e) => setEditData({ ...editData, alertThreshold: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setEditData({}); }}
                  className="flex-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add Expense to {expenseCategory?.name}</h3>
              <button 
                onClick={() => setShowAddExpense(false)}
                className="text-gray-500 hover:text-gray-700"
                type="button"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-4">
              {expenseError && <div className="text-red-500 text-sm">{expenseError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={expenseDescription}
                  onChange={e => setExpenseDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={e => setExpenseDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Expense
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {showEditExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Expense</h3>
              <button 
                onClick={() => setShowEditExpense(false)}
                className="text-gray-500 hover:text-gray-700"
                type="button"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditExpense} className="space-y-4">
              {editExpenseError && <div className="text-red-500 text-sm">{editExpenseError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={editExpenseAmount}
                  onChange={e => setEditExpenseAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={editExpenseDescription}
                  onChange={e => setEditExpenseDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={editExpenseDate}
                  onChange={e => setEditExpenseDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditExpense(false)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Adjust Spent state and modal */}
      {/* Remove showAdjustSpent, adjustSpentValue, adjustCategoryId, handleAdjustSpent, handleSaveAdjustSpent, and the Adjust Spent modal */}
    </div>
  );
};

export default Budget; 