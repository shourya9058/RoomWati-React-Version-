import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getCurrentUser();
      if (res.isAuthenticated && res.user) {
        setUser(res.user);
        const favIds = (res.user.favorites || []).map(f => (typeof f === 'object' ? f._id || f.id : f).toString());
        setFavorites(new Set(favIds));
      } else {
        setUser(null);
        setFavorites(new Set());
      }
    } catch (err) {
      console.warn('Auth check error:', err.message);
      setUser(null);
      setFavorites(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (identifier, password) => {
    const res = await api.login({ identifier, password });
    if (res.success && res.user) {
      setUser(res.user);
      const favIds = (res.user.favorites || []).map(f => (typeof f === 'object' ? f._id || f.id : f).toString());
      setFavorites(new Set(favIds));
    }
    return res;
  };

  const loginWithOtp = async (email, otp) => {
    const res = await api.verifyLoginOtp(email, otp);
    if (res.success && res.user) {
      setUser(res.user);
      const favIds = (res.user.favorites || []).map(f => (typeof f === 'object' ? f._id || f.id : f).toString());
      setFavorites(new Set(favIds));
    }
    return res;
  };

  const signup = async (userData) => {
    const res = await api.signup(userData);
    if (res.success && res.user) {
      setUser(res.user);
      setFavorites(new Set());
    }
    return res;
  };

  const verifySignupOtp = async (email, otp) => {
    const res = await api.verifySignupOtp(email, otp);
    if (res.success && res.user) {
      setUser(res.user);
      setFavorites(new Set());
    }
    return res;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setFavorites(new Set());
  };

  const toggleFavorite = async (listingId) => {
    if (!user) {
      throw new Error('Please login to save favorites');
    }

    const idStr = listingId.toString();
    // Optimistic update
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(idStr)) {
        next.delete(idStr);
      } else {
        next.add(idStr);
      }
      return next;
    });

    try {
      const res = await api.toggleFavorite(listingId);
      if (res.favorites) {
        const syncedIds = res.favorites.map(f => (typeof f === 'object' ? f._id || f.id : f).toString());
        setFavorites(new Set(syncedIds));
      }
      return res;
    } catch (err) {
      // Revert optimistic update
      setFavorites(prev => {
        const next = new Set(prev);
        if (next.has(idStr)) {
          next.delete(idStr);
        } else {
          next.add(idStr);
        }
        return next;
      });
      throw err;
    }
  };

  const isFavorite = (listingId) => {
    if (!listingId) return false;
    return favorites.has(listingId.toString());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
        login,
        loginWithOtp,
        signup,
        verifySignupOtp,
        logout,
        refreshUser: checkAuth,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
