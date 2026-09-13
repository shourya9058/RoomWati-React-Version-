import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useNotifications } from './NotificationContext';
import api from '../services/api';

const ChatContext = createContext(null);

// Robust helper to check if a user matches an entity (by ID, username, first name, or email)
function isUserMatch(entity, user) {
  if (!entity || !user) return false;
  const uid = (user._id || user.id || '')?.toString().toLowerCase().trim();
  const uname = (user.username || '')?.toLowerCase().trim();
  const uemail = (user.email || '')?.toLowerCase().trim();
  const ufirst = uname.split(/[\s._-]+/)[0];

  // If entity is a string (ID, name, or email)
  if (typeof entity === 'string') {
    const str = entity.toLowerCase().trim();
    if (uid && (str === uid || str.includes(uid) || uid.includes(str))) return true;
    if (uname && (str === uname || str.includes(uname) || uname.includes(str))) return true;
    if (ufirst && ufirst.length >= 3 && str.includes(ufirst)) return true;
    if (uemail && (str === uemail || str.includes(uemail))) return true;
    return false;
  }

  // If entity is an object
  const eId = (entity.id || entity._id || '')?.toString().toLowerCase().trim();
  const eName = (entity.name || entity.username || '')?.toLowerCase().trim();
  const eEmail = (entity.email || '')?.toLowerCase().trim();
  const efirst = eName.split(/[\s._-]+/)[0];

  // 1. Direct ID match
  if (uid && eId && (uid === eId || uid.includes(eId) || eId.includes(uid))) return true;

  // 2. Email match
  if (uemail && eEmail && (uemail === eEmail || uemail.split('@')[0] === eEmail.split('@')[0])) return true;

  // 3. Username / Full Name / First Name match
  if (uname && eName) {
    if (uname === eName) return true;
    if (uname.includes(eName) || eName.includes(uname)) return true;
    if (ufirst && efirst && ufirst.length >= 3 && (ufirst === efirst || ufirst.includes(efirst) || efirst.includes(ufirst))) return true;
  }

  return false;
}

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const { addNotification } = useNotifications();

  // Audio chime generator using Web Audio API
  const playNotificationSound = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio might be suppressed before first user interaction
    }
  }, []);

  // Floating incoming message alert state (for when user is outside chat)
  const [incomingAlert, setIncomingAlert] = useState(null);
  const knownMessageIdsRef = useRef(new Set());
  const isInitialLoadRef = useRef(true);

  const dismissIncomingAlert = useCallback(() => {
    setIncomingAlert(null);
  }, []);

  // Load from localStorage as initial cache
  const [allThreads, setAllThreads] = useState(() => {
    try {
      const saved = localStorage.getItem('roomwati_chat_threads');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((t) => t.id !== 'thread-1' && t.id !== 'thread-2');
        }
      }
    } catch (e) {
      console.warn('Failed to parse chat threads from localStorage', e);
    }
    return [];
  });

  const [activeThreadId, setActiveThreadId] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('roomwati_chat_threads', JSON.stringify(allThreads));
    } catch (e) {
      console.warn('Failed to save chat threads', e);
    }
  }, [allThreads]);

  // Fetch threads from backend API & detect new incoming messages
  const fetchThreadsFromAPI = useCallback(async () => {
    try {
      const data = await api.getChats();
      if (data && data.success && Array.isArray(data.threads)) {
        const validThreads = data.threads.filter((t) => t.id !== 'thread-1' && t.id !== 'thread-2');
          
          // Check for new incoming messages for the active user
          if (!isInitialLoadRef.current && user) {
            for (const thread of validThreads) {
              const isHost = isUserMatch(thread.host, user);
              const isTenant = isUserMatch(thread.tenant, user);
              if (!isHost && !isTenant) continue;

              const otherParty = isHost ? thread.tenant : thread.host;
              const messages = thread.messages || [];

              for (const msg of messages) {
                const msgId = msg.id || msg._id;
                if (!msgId) continue;

                if (!knownMessageIdsRef.current.has(msgId)) {
                  knownMessageIdsRef.current.add(msgId);

                  const isFromMe = isUserMatch(
                    { id: msg.senderId, name: msg.senderName, username: msg.senderName },
                    user
                  );

                  // If this is an incoming message from someone else
                  if (!isFromMe) {
                    playNotificationSound();

                    // If not on messages page or not in this active thread
                    const onMessagesPage = window.location.pathname === '/messages';
                    const isThreadActive = onMessagesPage && activeThreadId === thread.id;

                    if (!isThreadActive) {
                      setIncomingAlert({
                        threadId: thread.id,
                        senderName: otherParty?.name || msg.senderName || 'Someone',
                        senderAvatar: otherParty?.avatar,
                        listingTitle: thread.listingTitle || 'Listing Inquiry',
                        text: msg.text || 'Sent you a message',
                        timestamp: msg.timestamp || 'Just now',
                      });
                    }
                  }
                }
              }
            }
          } else {
            // First load: just record existing message IDs
            validThreads.forEach((t) => {
              (t.messages || []).forEach((m) => {
                const mId = m.id || m._id;
                if (mId) knownMessageIdsRef.current.add(mId);
              });
            });
            isInitialLoadRef.current = false;
          }

        setAllThreads(validThreads);
      }
    } catch (err) {
      // Backend offline fallback
    }
  }, [user, activeThreadId, playNotificationSound]);

  // Poll backend for new messages across all browsers / tabs every 3s
  useEffect(() => {
    fetchThreadsFromAPI();
    const interval = setInterval(fetchThreadsFromAPI, 3000);
    return () => clearInterval(interval);
  }, [fetchThreadsFromAPI]);

  // Real-time cross-tab storage listener
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'roomwati_chat_threads') {
        try {
          const updated = JSON.parse(e.newValue || '[]');
          if (Array.isArray(updated)) {
            setAllThreads(updated.filter((t) => t.id !== 'thread-1' && t.id !== 'thread-2'));
          }
        } catch (err) {
          console.error('Failed to parse updated storage threads', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Compute threads formatted for the currently active user account
  const threads = allThreads
    .map((t) => {
      // Normalize host entity
      const hostEntity = t.host || {
        id: t.hostId || t.participant?.id || 'host',
        name: t.hostName || t.participant?.name || 'Property Owner',
        avatar: t.hostAvatar || t.participant?.avatar,
        phone: t.hostPhone || t.participant?.phone,
        email: t.hostEmail,
      };

      // Normalize tenant entity
      const tenantEntity = t.tenant || {
        id: t.tenantId || t.creatorId || 'tenant',
        name:
          t.tenantName ||
          t.creatorName ||
          (t.messages?.[0]?.senderName && t.messages?.[0]?.senderName !== hostEntity.name
            ? t.messages[0].senderName
            : 'Interested Tenant'),
        avatar: t.tenantAvatar,
        phone: t.tenantPhone,
        email: t.tenantEmail,
      };

      const isHost = isUserMatch(hostEntity, user);
      const isTenant = isUserMatch(tenantEntity, user);

      // Show if user matches as host, tenant, or if testing as guest
      const isParticipant = !user || isHost || isTenant;
      if (!isParticipant) return null;

      // Determine the conversation partner to display in the header and sidebar
      const otherParty = isHost ? tenantEntity : hostEntity;

      const formattedOtherParty = {
        id: otherParty.id || (isHost ? 'tenant' : 'host'),
        name: otherParty.name || (isHost ? 'Interested Tenant' : 'Property Owner'),
        role: isHost ? 'Prospective Tenant' : 'Property Owner / Host',
        avatar: otherParty.avatar || null,
        phone: otherParty.phone || (isHost ? '+91 98765 00000' : '+91 98765 43210'),
        verified: true,
        online: true,
      };

      // Format messages with dynamic alignment
      const formattedMessages = (t.messages || []).map((msg) => {
        const isSender = isUserMatch(
          { id: msg.senderId, name: msg.senderName, username: msg.senderName },
          user
        );
        return {
          ...msg,
          isMine: isSender,
        };
      });

      // Calculate unread count for this thread
      const isUnreadForMe = (t.unreadBy || []).some((uid) => isUserMatch(uid, user));
      let unreadForMe = 0;
      if (isUnreadForMe) {
        // Count incoming messages from the other user
        const incomingCount = formattedMessages.filter((m) => !m.isMine).length;
        unreadForMe = incomingCount > 0 ? incomingCount : 1;
      }

      const listingImg =
        t.listingImage && typeof t.listingImage === 'string' && t.listingImage.trim() !== ''
          ? t.listingImage
          : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

      return {
        ...t,
        listingImage: listingImg,
        host: hostEntity,
        tenant: tenantEntity,
        participant: formattedOtherParty,
        unreadCount: unreadForMe,
        messages: formattedMessages,
      };
    })
    .filter(Boolean);

  const activeThread =
    threads.find((t) => t.id === activeThreadId) || (threads.length > 0 ? threads[0] : null);

  const totalUnreadMessages = threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);

  const markThreadAsRead = useCallback(
    (threadId) => {
      if (!threadId) return;

      setAllThreads((prev) =>
        prev.map((t) => {
          if (t.id === threadId) {
            const unreadBy = (t.unreadBy || []).filter((uid) => !isUserMatch(uid, user));
            return { ...t, unreadBy };
          }
          return t;
        })
      );

      // Dismiss floating alert if it belongs to this thread
      setIncomingAlert((prev) => (prev?.threadId === threadId ? null : prev));

      // Sync with backend API
      if (user) {
        api.markChatRead(threadId, {
          userId: user._id || user.id,
          username: user.username,
          userEmail: user.email,
        }).catch(() => {});
      }
    },
    [user]
  );

  const selectThread = useCallback(
    (threadId) => {
      setActiveThreadId(threadId);
      markThreadAsRead(threadId);
    },
    [markThreadAsRead]
  );

  const startConversationWithHost = useCallback(
    ({ listing, initialMessage }) => {
      const listingId = (listing._id || listing.id || 'custom-listing')?.toString();
      const hostId = (
        listing.owner?._id ||
        listing.owner?.id ||
        (typeof listing.owner === 'string' ? listing.owner : '')
      )?.toString();
      const hostName = listing.owner?.username || 'Property Host';
      const hostEmail = listing.owner?.email || 'host@roomwati.com';
      const hostPhone = listing.owner?.phone || '+91 98765 43210';

      const tenantId = (user?._id || user?.id || user?.username || 'tenant-user')?.toString();
      const tenantName = user?.username || 'Interested Tenant';
      const tenantEmail = user?.email || 'tenant@roomwati.com';
      const tenantPhone = user?.phone || '+91 98765 00000';

      // Check if thread already exists for this listing and tenant
      const existing = allThreads.find(
        (t) =>
          t.listingId === listingId &&
          (isUserMatch(t.tenant, user) || t.tenant?.id === tenantId || t.tenant?.name === tenantName)
      );

      if (existing) {
        setActiveThreadId(existing.id);
        if (initialMessage) {
          sendMessage(existing.id, initialMessage);
        }
        return existing.id;
      }

      // Create new conversation thread
      const newThreadId = `thread-${Date.now()}`;
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const listingImgUrl = listing.image?.url || (typeof listing.image === 'string' ? listing.image : null) || null;
      const tenantAvatarUrl = user?.image?.url || (typeof user?.image === 'string' ? user.image : null) || user?.avatar || null;
      const hostAvatarUrl = listing.owner?.image?.url || (typeof listing.owner?.image === 'string' ? listing.owner.image : null) || listing.owner?.avatar || null;

      const newThread = {
        id: newThreadId,
        listingId,
        listingTitle: listing.title || 'Room in ' + (listing.location || 'Metro Hub'),
        listingPrice: listing.price || 15000,
        listingLocation: listing.location || 'India',
        listingImage: listingImgUrl,
        tenant: {
          id: tenantId,
          name: tenantName,
          email: tenantEmail,
          phone: tenantPhone,
          avatar: tenantAvatarUrl,
        },
        host: {
          id: hostId,
          name: hostName,
          email: hostEmail,
          phone: hostPhone,
          avatar: hostAvatarUrl,
        },
        lastMessage: initialMessage || 'Conversation started regarding property details.',
        lastMessageTime: timeString,
        lastSenderId: tenantId,
        unreadBy: [hostId, hostName, hostEmail],
        messages: [
          ...(initialMessage
            ? [
                {
                  id: `msg-${Date.now()}-1`,
                  senderId: tenantId,
                  senderName: tenantName,
                  text: initialMessage,
                  timestamp: timeString,
                  createdAt: Date.now(),
                },
              ]
            : []),
        ],
      };

      setAllThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(newThreadId);

      // Save to backend API
      api.saveChat(newThread).catch(() => {});

      // Notify Host
      addNotification({
        type: 'welcome',
        title: `💬 New Inquiry: ${listing.title}`,
        message: `${tenantName} sent you a message regarding "${listing.title}".`,
        link: `/messages?id=${newThreadId}`,
        category: 'activity',
        badge: 'Chat',
        recipientId: hostId,
        recipientUsername: hostName,
        recipientEmail: hostEmail,
      });

      toast.success('Chat Started', `Connected with ${hostName} for "${listing.title}".`);

      return newThreadId;
    },
    [allThreads, user, toast, addNotification]
  );

  const sendMessage = useCallback(
    (threadId, text) => {
      if (!text || !text.trim()) return;

      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const senderId = (user?._id || user?.id || user?.username || 'user')?.toString();
      const senderName = user?.username || 'You';

      const userMsg = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        senderId,
        senderName,
        text: text.trim(),
        timestamp: timeString,
        createdAt: Date.now(),
      };

      let recipientInfo = null;

      setAllThreads((prev) =>
        prev.map((t) => {
          if (t.id === threadId) {
            const isMeTenant = isUserMatch(t.tenant, user);
            const targetRecipient = isMeTenant ? t.host : t.tenant;
            recipientInfo = targetRecipient;

            // Notify recipient
            addNotification({
              type: 'welcome',
              title: `💬 New Message from ${senderName}`,
              message: text.trim(),
              link: `/messages?id=${threadId}`,
              category: 'activity',
              badge: 'Message',
              recipientId: targetRecipient?.id,
              recipientUsername: targetRecipient?.name,
              recipientEmail: targetRecipient?.email,
            });

            const unreadBy = targetRecipient?.id
              ? Array.from(new Set([...(t.unreadBy || []), targetRecipient.id, targetRecipient.name, targetRecipient.email]))
              : [];

            return {
              ...t,
              lastMessage: text.trim(),
              lastMessageTime: timeString,
              lastSenderId: senderId,
              unreadBy,
              messages: [...(t.messages || []), userMsg],
            };
          }
          return t;
        })
      );

      // Save message to backend API
      api.sendChatMessage(threadId, {
        message: userMsg,
        lastSenderId: senderId,
        unreadBy: recipientInfo?.id
          ? [recipientInfo.id, recipientInfo.name, recipientInfo.email].filter(Boolean)
          : [],
      }).catch(() => {});
    },
    [user, addNotification]
  );

  const deleteThread = useCallback(
    (threadId) => {
      setAllThreads((prev) => prev.filter((t) => t.id !== threadId));
      if (activeThreadId === threadId) {
        setActiveThreadId(null);
      }
      api.deleteChat(threadId).catch(() => {});
      toast.info('Conversation Deleted', 'Chat thread removed from your inbox.');
    },
    [activeThreadId, toast]
  );

  // Dynamically update browser tab title with unread message badges (like WhatsApp / Messenger)
  useEffect(() => {
    const baseTitle = 'RoomWati | Verified Zero Brokerage Rentals';
    if (totalUnreadMessages > 0) {
      document.title = `(${totalUnreadMessages}) 💬 New Message | RoomWati`;
    } else {
      if (document.title.startsWith('(')) {
        document.title = baseTitle;
      }
    }
  }, [totalUnreadMessages]);

  return (
    <ChatContext.Provider
      value={{
        threads,
        activeThread,
        activeThreadId,
        selectThread,
        totalUnreadMessages,
        startConversationWithHost,
        sendMessage,
        markThreadAsRead,
        deleteThread,
        incomingAlert,
        dismissIncomingAlert,
        playNotificationSound,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
