import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem('admin') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const loginUser = (userData, tok) => {
    setUser(userData);
    setToken(tok);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tok);
  };

  const loginAdmin = (adminData, tok) => {
    setAdmin(adminData);
    setToken(tok);
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('token', tok);
  };

  const logoutUser = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const logoutAdmin = () => {
    setAdmin(null);
    setToken('');
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, admin, token, loginUser, loginAdmin, logoutUser, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
