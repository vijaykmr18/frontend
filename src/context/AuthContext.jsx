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
    const authData = Array.isArray(data.data) ? data.data[0] : data.data;
    const accessToken = authData?.access_token || data.access_token || data.token;

    if (!accessToken) {
      throw new Error('The server did not return an access token.');
    }

    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/register', {
      name,
      email,
      password,
      role: 'user',
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
    <AuthContext.Provider value={{ token, user, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
