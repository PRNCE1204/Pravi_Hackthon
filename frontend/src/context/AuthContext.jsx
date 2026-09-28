import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const DEMO_PASSWORD = 'Test@123';

export const getDashboardPath = (role) => {
  switch (role?.toLowerCase()) {
    case 'citizen':
      return '/citizen';
    case 'contractor':
      return '/contractor';
    case 'engineer':
      return '/engineer';
    case 'officer':
      return '/officer';
    case 'finance':
      return '/finance';
    case 'admin':
      return '/admin';
    default:
      return '/citizen';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Restore & verify session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const res = await authService.getProfile();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          } else {
            handleLogout();
          }
        } catch (err) {
          console.warn('[AuthContext] Session restoration failed:', err.message);
          handleLogout();
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const handleLogin = useCallback(async ({ email, password }) => {
    const res = await authService.login({ email, password });
    const token = res.token;
    const user = res.user;
    if (token && user) {
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    throw new Error(res.message || 'Login failed');
  }, []);

  const handleRegister = useCallback(async ({ name, email, password }) => {
    const res = await authService.register({ name, email, password });
    const token = res.token;
    const user = res.user;
    if (token && user) {
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    throw new Error(res.message || 'Registration failed');
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getDashboardPath,
    demoPassword: DEMO_PASSWORD,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
