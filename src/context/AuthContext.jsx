import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      // Decode JWT to extract role (if present)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
        if (payload.role === 'admin' || payload.isAdmin) {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error('Invalid token');
        logout();
      }
    }
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    localStorage.setItem('token', data.access_token || data.token);
    setToken(data.access_token || data.token);
    return data;
  };

  const register = async (username, email, password) => {
    const { data } = await api.post('/register', { username, email, password });
    localStorage.setItem('token', data.access_token || data.token);
    setToken(data.access_token || data.token);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};