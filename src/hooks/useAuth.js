
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('https://link-saver-backend-bi2u.onrender.com/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (error) {
          console.error('Token verification failed:', error.response?.data?.message || error.message);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ id: res.data.id, email });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ id: res.data.id, email });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, login, register, logout, isLoading };
};
