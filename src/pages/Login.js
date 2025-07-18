import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 
    try {
      console.log('Email:', email);
      console.log('Password:', password);
      await login(email, password); 
      navigate('/dashboard'); 
    } catch (err) {
      console.error('Error during login:', err.code, err.message);
      setError('Failed to log in. Please check your email and password.'); 
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded shadow"
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>
        {location.state && location.state.message && (
          <div className="mb-4 text-green-600">{location.state.message}</div>
        )}
        {error && <div className="mb-4 text-red-600">{error}</div>} {/* Display error message */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Log In
        </button>
        <p>Don't have an account?</p>  {/* Add "Don't have an account?" text */} <a href="/signup" className="text-blue-600">Sign Up</a> 
       
      </form>
    </div>
  );
};

export default Login;
