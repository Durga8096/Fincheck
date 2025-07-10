import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  apiLogin,
  apiRegister,
  apiGetProfile,
  apiUpdateProfile
} from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to get token from localStorage
  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const tryFetchProfile = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const user = await apiGetProfile(token);
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
      setLoading(false);
    };
    tryFetchProfile();
  }, []);

  const login = async (email, password) => {
    const { token, user } = await apiLogin(email, password);
    localStorage.setItem('token', token);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const register = async (name, email, password) => {
    const { token, user } = await apiRegister(name, email, password);
    localStorage.setItem('token', token);
    setCurrentUser(user);
    return user;
  };

  const updateProfile = async (profile) => {
    const token = getToken();
    const user = await apiUpdateProfile(profile, token);
    setCurrentUser(user);
    return user;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
