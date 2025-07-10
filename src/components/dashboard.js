import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear JWT/token and redirect to login
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 text-white bg-gray-800">
        <div className="p-4 text-2xl font-bold text-center border-b border-gray-700">
          MyDashboard
        </div>
        <nav className="flex-grow p-4">
          <ul className="space-y-4">
            <li>
              <Link to="/dashboard/home" className="block p-2 rounded hover:bg-gray-700">
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard/analytics" className="block p-2 rounded hover:bg-gray-700">
                Analytics
              </Link>
            </li>
            <li>
              <Link to="/dashboard/transactions" className="block p-2 rounded hover:bg-gray-700">
                Transactions
              </Link>
            </li>
            <li>
              <Link to="/dashboard/budget" className="block p-2 rounded hover:bg-gray-700">
                Budget
              </Link>
            </li>
            <li>
              <Link to="/dashboard/settings" className="block p-2 rounded hover:bg-gray-700">
                Settings
              </Link>
            </li>
            <li>
              <Link to="/dashboard/profile" className="block p-2 rounded hover:bg-gray-700">
                Profile
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full p-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="p-4 bg-white shadow-md">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-grow p-6 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
