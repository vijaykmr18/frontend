import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { getSessionFromToken } from '../utils/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const initialSession = getSessionFromToken(localStorage.getItem('token'));
  const [token, setToken] = useState(initialSession?.token || null);
  const [user, setUser] = useState(initialSession?.user || null);
  const [isAdmin, setIsAdmin] = useState(initialSession?.isAdmin || false);
  const [authReady, setAuthReady] = useState(true);

  useEffect(() => {
    const session = getSessionFromToken(token);
    if (!session) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAdmin(false);
    } else {
      setUser(session.user);
      setIsAdmin(session.isAdmin);
    }
    setAuthReady(true);
  }, [token]);

  useEffect(() => {
    const clearExpiredSession = () => {
      setToken(null);
      setUser(null);
      setIsAdmin(false);
    };

    window.addEventListener('auth:expired', clearExpiredSession);
    return () => window.removeEventListener('auth:expired', clearExpiredSession);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    const authData = Array.isArray(data.data) ? data.data[0] : data.data;
    const accessToken = authData?.access_token || data.access_token || data.token;

    if (!accessToken) {
      throw new Error('The server did not return an access token.');
    }

    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    const session = getSessionFromToken(accessToken);
    setUser(session?.user || null);
    setIsAdmin(session?.isAdmin || false);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await api.post('/register', {
      name,
      email,
      password,
      role,
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, authReady, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
