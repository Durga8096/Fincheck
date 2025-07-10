import React, { useEffect, useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  DollarSign, 
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { apiGetProfile, apiGetTransactions, apiGetBudgets } from '../api';

const Settings = () => {
  const [profile, setProfile] = useState({});
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const [profileData, budgetsData] = await Promise.all([
          apiGetProfile(token),
          apiGetBudgets(token)
        ]);
        setProfile(profileData);
        setBudgets(budgetsData);
      } catch (err) {
        setError('Failed to load settings');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const downloadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [profile, transactions, budgets] = await Promise.all([
        apiGetProfile(token),
        apiGetTransactions(token),
        apiGetBudgets(token)
      ]);
      const data = { profile, transactions, budgets };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fitcheck_data.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download data: ' + err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading settings...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Settings</h2>

      {/* Profile Settings */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <User size={24} className="text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">Profile Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              value={profile.name || ''}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              value={profile.email || ''}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={profile.phone || ''}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input 
              type="text" 
              value={profile.location || ''}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard size={24} className="text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-800">Budget Categories</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((cat) => (
            <div key={cat._id} className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-semibold text-gray-800">{cat.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Limit:</span>
                <span className="font-semibold">₹{cat.limit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Alert at:</span>
                <span className="font-semibold">{cat.alertThreshold}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download Data */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Download size={24} className="text-green-600" />
          <h3 className="text-xl font-semibold text-gray-800">Export Data</h3>
        </div>
        <button
          onClick={downloadData}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Download All Data
        </button>
      </div>
    </div>
  );
};

export default Settings;
