import { createContext, useState, useEffect, useContext } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Validate token on load
  useEffect(() => {
    const verifyToken = async () => {
      if (user && user.token) {
        try {
          const res = await API.get('/users/profile');
          setUser(prev => ({ ...prev, ...res.data }));
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();

    const handleGlobalLogout = () => {
      logout();
    };

    window.addEventListener('echobeats:logout', handleGlobalLogout);
    return () => window.removeEventListener('echobeats:logout', handleGlobalLogout);
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/users/login', { email, password });
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  };

  const signup = async (username, email, password) => {
    const res = await API.post('/users/register', { username, email, password });
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
