import React from 'react';
import Header from './components/header';
import Hero from './components/hero';
import Footer from './components/footer';
import Login from './pages/Login';
import Signup from './pages/signup';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Home from './components/home';
import Analytics from './components/analytics';
import Settings from './components/settings';
import Profile from './components/profile';
import Transactions from './components/transactions';
import Budget from './components/budget';



function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="flex flex-col min-h-screen bg-[#FFFAFA]">
      <Header />
        <div className="">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />}>
            <Route path="/dashboard/home" element={<Home />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/transactions" element={<Transactions />} />
            <Route path="/dashboard/budget" element={<Budget />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/profile" element={<Profile />} />
          </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
