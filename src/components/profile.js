import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiGetProfile } from '../api';
import { 
  User, 
  Target, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Award,
  Star,
  Edit3,
  Save,
  X
} from 'lucide-react';

const LOCAL_STORAGE_PROFILE = 'fitcheck_profile';

const Profile = () => {
  const { currentUser, updateProfile } = useContext(AuthContext);
  const fileInputRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(currentUser || {});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const user = await apiGetProfile(token);
        setProfile(user);
      } catch (err) {
        setError('Failed to load profile');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const [financialGoals] = useState([
    { id: 1, name: 'Emergency Fund', target: 10000, current: 8500, deadline: '2024-06-30', completed: false },
    { id: 2, name: 'Vacation Fund', target: 5000, current: 3200, deadline: '2024-08-15', completed: false },
    { id: 3, name: 'Investment Portfolio', target: 25000, current: 18000, deadline: '2024-12-31', completed: false }
  ]);

  const [achievements] = useState([
    { id: 1, title: 'First Month', description: 'Completed your first month of tracking', icon: '🎯', unlocked: true },
    { id: 2, title: 'Budget Master', description: 'Stayed under budget for 3 consecutive months', icon: '💰', unlocked: true },
    { id: 3, title: 'Saver', description: 'Saved $1000 in a single month', icon: '🏆', unlocked: true },
    { id: 4, title: 'Analyst', description: 'Viewed analytics for 30 days', icon: '📊', unlocked: false },
    { id: 5, title: 'Consistent', description: 'Logged transactions for 100 days', icon: '📅', unlocked: false }
  ]);

  const [stats] = useState({
    totalTransactions: 156,
    averageMonthlySpending: 1879.50,
    totalSavings: 12500,
    streakDays: 45,
    categoriesUsed: 8,
    budgetAccuracy: 92
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(profile);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfile({ ...profile, avatar: ev.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getGoalProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getGoalStatus = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Profile</h2>

      {/* Profile Header */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img 
                src={profile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 cursor-pointer"
                onClick={handleAvatarClick}
                title="Click to change profile picture"
              />
              <button type="button" onClick={handleAvatarClick} className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700">
                <Edit3 size={16} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-600">{profile.location}</p>
              <p className="text-sm text-gray-500">Member since {profile.joinDate}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? <X size={16} /> : <Edit3 size={16} />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing && (
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Transactions</p>
              <p className="text-3xl font-bold">{stats.totalTransactions}</p>
            </div>
            <TrendingUp size={32} className="text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Savings</p>
              <p className="text-3xl font-bold">₹{stats.totalSavings.toLocaleString('en-IN')}</p>
            </div>
            <Trophy size={32} className="text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Streak Days</p>
              <p className="text-3xl font-bold">{stats.streakDays}</p>
            </div>
            <Calendar size={32} className="text-purple-200" />
          </div>
        </div>
      </div>

      {/* Financial Goals */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Target size={24} className="text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">Financial Goals</h3>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Goal
          </button>
        </div>
        <div className="space-y-4">
          {financialGoals.map((goal) => {
            const progress = getGoalProgress(goal.current, goal.target);
            return (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{goal.name}</h4>
                    <p className="text-sm text-gray-600">Deadline: {goal.deadline}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      ₹{goal.current.toLocaleString('en-IN')} / ₹{goal.target.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-600">{progress.toFixed(1)}% Complete</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getGoalStatus(progress)}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Award size={24} className="text-yellow-600" />
          <h3 className="text-xl font-semibold text-gray-800">Achievements</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border-2 ${
                achievement.unlocked 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h4 className={`font-semibold ${
                    achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm ${
                    achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <Star size={16} className="text-yellow-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Spending</span>
              <span className="font-semibold">₹{stats.averageMonthlySpending.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Categories Used</span>
              <span className="font-semibold">{stats.categoriesUsed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Budget Accuracy</span>
              <span className="font-semibold">{stats.budgetAccuracy}%</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              Export Financial Data
            </button>
            <button className="w-full p-3 text-left bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              Set New Goal
            </button>
            <button className="w-full p-3 text-left bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              View Detailed Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
