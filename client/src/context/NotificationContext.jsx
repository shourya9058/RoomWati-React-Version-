import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();

  const [allNotifications, setAllNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('roomwati_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Purge all mock, dummy, or hardcoded legacy notifications
          return parsed.filter(
            (n) =>
              !n.isMock &&
              n.id !== 'notif-1' &&
              n.id !== 'notif-2' &&
              n.id !== 'notif-3' &&
              n.id !== 'notif-4' &&
              n.id !== 'notif-5' &&
              !n.id?.startsWith('mock-')
          );
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved notifications from localStorage', e);
    }
    return [];
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('roomwati_notifications', JSON.stringify(allNotifications));
    } catch (e) {
      console.warn('Failed to save notifications to localStorage', e);
    }
  }, [allNotifications]);

  // Real-time cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'roomwati_notifications') {
        try {
          const updated = JSON.parse(e.newValue || '[]');
          if (Array.isArray(updated)) {
            setAllNotifications(
              updated.filter(
                (n) =>
                  !n.isMock &&
                  n.id !== 'notif-1' &&
                  n.id !== 'notif-2' &&
                  n.id !== 'notif-3' &&
                  n.id !== 'notif-4' &&
                  n.id !== 'notif-5' &&
                  !n.id?.startsWith('mock-')
              )
            );
          }
        } catch (err) {
          console.error('Failed to parse storage notifications', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const currentUserId = (user?._id || user?.id || '')?.toString().toLowerCase().trim();
  const currentUsername = (user?.username || '')?.toLowerCase().trim();
  const currentUserEmail = (user?.email || '')?.toLowerCase().trim();
  const currentDisplayName = (user?.name || user?.username || 'User').trim();

  // Strict user isolation: Notifications are only visible if they belong to the current authenticated user
  const notifications = !user ? [] : allNotifications.filter((n) => {
    if (!n) return false;

    // 1. Never show mock or test dummy notifications
    if (n.isMock || n.id === 'notif-1' || n.id === 'notif-2' || n.id === 'notif-3' || n.id === 'notif-4' || n.id === 'notif-5' || n.id?.startsWith('mock-')) {
      return false;
    }

    const rId = (n.recipientId || '')?.toString().toLowerCase().trim();
    const rName = (n.recipientUsername || '')?.toLowerCase().trim();
    const rEmail = (n.recipientEmail || '')?.toLowerCase().trim();

    // 2. Strict match on user ID, username, or email
    if (rId && currentUserId && (rId === currentUserId || currentUserId.includes(rId) || rId.includes(currentUserId))) {
      return true;
    }

    if (rName && currentUsername && (rName === currentUsername || rName === currentUsername.split(' ')[0])) {
      return true;
    }

    if (rEmail && currentUserEmail && rEmail === currentUserEmail) {
      return true;
    }

    // 3. Fallback check for personalized welcome notifications: strictly match current user's name
    if (n.type === 'welcome' && currentUsername && (
      n.title?.toLowerCase().includes(currentUsername) ||
      n.title?.toLowerCase().includes(currentDisplayName.toLowerCase())
    )) {
      return true;
    }

    // Reject notifications belonging to other accounts on this browser
    return false;
  });

  // Automatically ensure the logged-in user gets their own personalized welcome notification
  useEffect(() => {
    if (!user || !currentUsername) return;

    const hasMyWelcome = allNotifications.some((n) => {
      const rId = (n.recipientId || '')?.toString().toLowerCase().trim();
      const rName = (n.recipientUsername || '')?.toLowerCase().trim();
      return (
        (rId && currentUserId && rId === currentUserId) ||
        (rName && currentUsername && rName === currentUsername)
      );
    });

    if (!hasMyWelcome) {
      const newWelcome = {
        id: `welcome-${currentUserId || currentUsername}-${Date.now()}`,
        type: 'welcome',
        title: `Welcome to RoomWati, ${currentDisplayName}!`,
        message: 'Your account is ready. Browse verified rooms or list your space today.',
        time: 'Just now',
        timestamp: Date.now(),
        read: false,
        link: '/listings',
        category: 'activity',
        badge: 'New Account',
        recipientId: currentUserId || null,
        recipientUsername: currentUsername,
        recipientEmail: currentUserEmail,
      };

      setAllNotifications((prev) => [newWelcome, ...prev]);
    }
  }, [user, currentUserId, currentUsername, currentUserEmail, currentDisplayName, allNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((newNotif) => {
    const item = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: newNotif.type || 'system',
      title: newNotif.title,
      message: newNotif.message,
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      link: newNotif.link || '/listings',
      category: newNotif.category || 'activity',
      badge: newNotif.badge || 'New',
      recipientId: newNotif.recipientId ? newNotif.recipientId.toString() : (currentUserId || null),
      recipientUsername: newNotif.recipientUsername || currentUsername || null,
      recipientEmail: newNotif.recipientEmail || currentUserEmail || null,
      ...newNotif,
    };

    setAllNotifications((prev) => [item, ...prev]);
    return item;
  }, [currentUserId, currentUsername, currentUserEmail]);

  const markAsRead = useCallback((id) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setAllNotifications((prev) =>
      prev.map((n) => {
        const isMine =
          (n.recipientId && currentUserId && n.recipientId.toString().toLowerCase() === currentUserId) ||
          (n.recipientUsername && currentUsername && n.recipientUsername.toLowerCase() === currentUsername);
        return isMine ? { ...n, read: true } : n;
      })
    );
  }, [currentUserId, currentUsername]);

  const deleteNotification = useCallback((id) => {
    setAllNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setAllNotifications((prev) =>
      prev.filter((n) => {
        const isMine =
          (n.recipientId && currentUserId && n.recipientId.toString().toLowerCase() === currentUserId) ||
          (n.recipientUsername && currentUsername && n.recipientUsername.toLowerCase() === currentUsername);
        return !isMine;
      })
    );
  }, [currentUserId, currentUsername]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
