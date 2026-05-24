import { createContext, useEffect, useState } from 'react';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../services/api.js';
import { fetchProfile, loginUser, registerUser } from '../services/authService.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const stored = getStoredAuth();

      if (!stored.token) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const profileResponse = await fetchProfile(stored.token);
        if (mounted) {
          setUser(profileResponse.user);
          setToken(stored.token);
        }
      } catch {
        clearStoredAuth();
        if (mounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleRegister(payload) {
    setError('');
    const response = await registerUser(payload);
    setStoredAuth(response.token, response.user);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  }

  async function handleLogin(payload) {
    setError('');
    const response = await loginUser(payload);
    setStoredAuth(response.token, response.user);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  }

  function handleLogout() {
    clearStoredAuth();
    setUser(null);
    setToken(null);
  }

  const value = {
    user,
    token,
    loading,
    error,
    setError,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: Boolean(user && token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}