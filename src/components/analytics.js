import React, { useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon,
  BarChart3,
  Calendar
} from 'lucide-react';
import { apiGetTransactions } from '../api';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
    fetchTransactions();
  }, []);

  // Calculate analytics from transactions
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalSavings = totalIncome - totalExpenses;

  // Expense breakdown by category
  const expenseByCategory = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
  });
  const expenseData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Monthly data for charts (group by month)
  const monthlyMap = {};
  transactions.forEach(t => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlyMap[month]) monthlyMap[month] = { month, income: 0, expenses: 0 };
    if (t.type === 'income') monthlyMap[month].income += t.amount;
    if (t.type === 'expense') monthlyMap[month].expenses += t.amount;
  });
  const monthlyData = Object.values(monthlyMap).sort((a, b) => new Date('1 ' + a.month) - new Date('1 ' + b.month)).map(m => ({ ...m, savings: m.income - m.expenses }));

  // Category comparison (this month vs last month)
  const categoryComparison = [];
  const currentMonth = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('default', { month: 'short', year: 'numeric' });

  Object.entries(expenseByCategory).forEach(([category, currentMonthAmount]) => {
    const lastMonthAmount = expenseByCategory[category] || 0;
    const change = lastMonthAmount > 0 ? ((currentMonthAmount - lastMonthAmount) / lastMonthAmount * 100).toFixed(0) + '%' : 'N/A';
    categoryComparison.push({ category, thisMonth: currentMonthAmount, lastMonth: lastMonthAmount, change });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Financial Analytics</h2>
          <p className="text-gray-600">Track your spending patterns and financial health</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg ${
              selectedPeriod === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg ${
              selectedPeriod === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 rounded-lg ${
              selectedPeriod === 'year' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Income</p>
              <p className="text-3xl font-bold">${totalIncome.toLocaleString()}</p>
            </div>
            <TrendingUp size={32} className="text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold">${totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingDown size={32} className="text-red-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Net Savings</p>
              <p className="text-3xl font-bold">${totalSavings.toLocaleString()}</p>
            </div>
            <DollarSign size={32} className="text-blue-200" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={24} className="text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">Expense Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 50}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expenses Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={24} className="text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800">Income vs Expenses</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                strokeWidth={3}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Comparison */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={24} className="text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-800">Category Comparison</h3>
        </div>
        <div className="space-y-4">
          {categoryComparison.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${index * 50}, 70%, 50%)` }}></div>
                <div>
                  <p className="font-semibold text-gray-800">{item.category}</p>
                  <p className="text-sm text-gray-600">This month: ${item.thisMonth}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">${item.thisMonth}</p>
                <p className={`text-sm ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change} vs last month
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Trend */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Savings Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, 'Savings']} />
            <Bar dataKey="savings" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Financial Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-xl text-white">
          <h4 className="text-lg font-semibold mb-2">💡 Financial Insight</h4>
          <p className="text-yellow-100">
            Your entertainment spending increased by 33% this month. Consider setting a budget limit for this category.
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 rounded-xl text-white">
          <h4 className="text-lg font-semibold mb-2">🎯 Goal Progress</h4>
          <p className="text-green-100">
            You're on track to save $6,000 this year! Keep up the good work with your current spending habits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
