'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://nexus-ai-backend-6nko.onrender.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('nexus_token');
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Bypass-Tunnel-Reminder': 'true'
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || data.data?.user);
      } else {
        localStorage.removeItem('nexus_token');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && (data.success || data.token)) {
        const token = data.token || data.data?.access_token;
        localStorage.setItem('nexus_token', token);
        setUser(data.user || data.data?.user);
        return { success: true };
      }
      return { success: false, error: data.error || data.message || 'Login failed' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Cannot connect to server' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok && (data.success || data.token)) {
        const token = data.token || data.data?.access_token;
        localStorage.setItem('nexus_token', token);
        setUser(data.user || data.data?.user);
        return { success: true };
      }
      return { success: false, error: data.error || data.message || 'Signup failed' };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, error: 'Cannot connect to server' };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('nexus_token', data.data.access_token);
        setUser(data.data.user);
        return { success: true };
      }
      return { success: false, error: data.message || 'Google login failed' };
    } catch (err) {
      console.error('Google auth error:', err);
      return { success: false, error: 'Google authentication failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('nexus_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, googleLogin, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
