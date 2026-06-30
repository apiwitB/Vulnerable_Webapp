import { createContext, useState, useEffect, useContext } from 'react';
import * as authApi from '../api/auth';
import * as usersApi from '../api/users';

const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(payloadBase64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('[shadowMarket] Token decoding failed:', e);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Sync token and user logic
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      
      // [VULN] Decode JWT payload on the client without verifying the signature
      const decoded = decodeToken(token);
      if (decoded && decoded.sub) {
        // Find user role, etc. from decoded token
        // Keep in mind that we also fetch user details from backend (which is IDOR-vulnerable too)
        const username = decoded.sub;
        
        // If user state is not already set (e.g. on refresh)
        if (!user) {
          const defaultUser = { username, role: decoded.role || 'user', id: decoded.id || 1 };
          setUser(defaultUser);
          localStorage.setItem('user', JSON.stringify(defaultUser));
        }
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  // Check user details in localStorage dynamically to allow client-side tampering of roles
  // Users can change role in localStorage to bypass AdminRoute checks!
  const getTamperedUser = () => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return user;
      }
    }
    return user;
  };

  const loginUser = async (username, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(username, password);
      const accessToken = response.access_token;
      
      // Store token synchronously to prevent race conditions during navigation
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      
      // Decode user info
      const decoded = decodeToken(accessToken);
      const tempUser = {
        username,
        role: decoded?.role || 'user',
        id: decoded?.id || 1
      };
      
      localStorage.setItem('user', JSON.stringify(tempUser));
      setUser(tempUser);
      
      return tempUser;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const registerUser = async (username, email, password) => {
    setLoading(true);
    try {
      const newUser = await authApi.register(username, email, password);
      setLoading(false);
      return newUser;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logoutUser = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    token,
    user: getTamperedUser(), // [VULN] Read from localStorage directly to allow local storage tampering attack
    loading,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    setUser: (u) => {
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
