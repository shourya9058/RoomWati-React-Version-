import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useNotifications } from './NotificationContext';
import api from '../services/api';

const VisitContext = createContext(null);

function isUserMatch(entity, user) {
  if (!entity || !user) return false;
  const uid = (user._id || user.id || '')?.toString().toLowerCase().trim();
  const uname = (user.username || '')?.toLowerCase().trim();
  const uemail = (user.email || '')?.toLowerCase().trim();
  const ufirst = uname.split(/[\s._-]+/)[0];

  if (typeof entity === 'string') {
    const str = entity.toLowerCase().trim();
    if (uid && (str === uid || str.includes(uid) || uid.includes(str))) return true;
    if (uname && (str === uname || str.includes(uname) || uname.includes(str))) return true;
    if (ufirst && ufirst.length >= 3 && str.includes(ufirst)) return true;
    if (uemail && (str === uemail || str.includes(uemail))) return true;
    return false;
  }

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

export function VisitProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const { addNotification } = useNotifications();

  // Load from localStorage as initial cache
  const [allVisits, setAllVisits] = useState(() => {
    try {
      const saved = localStorage.getItem('roomwati_scheduled_visits');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (v) =>
              v.id !== 'visit-101' &&
              v.id !== 'visit-102' &&
              v.id !== 'visit-103'
          );
        }
      }
    } catch (e) {
      console.warn('Failed to parse visits from localStorage', e);
    }
    return [];
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('roomwati_scheduled_visits', JSON.stringify(allVisits));
    } catch (e) {
      console.warn('Failed to save visits', e);
    }
  }, [allVisits]);

  // Fetch visits from backend API
  const fetchVisitsFromAPI = useCallback(async () => {
    try {
      const data = await api.getVisits();
      if (data && data.success && Array.isArray(data.visits)) {
        const validVisits = data.visits.filter(
          (v) => v.id !== 'visit-101' && v.id !== 'visit-102' && v.id !== 'visit-103'
        );
        setAllVisits(validVisits);
      }
    } catch (err) {
      // Backend might be offline or network glitch; fallback to localStorage
    }
  }, []);

  // Poll backend for new visits across all browsers / tabs every 3s
  useEffect(() => {
    fetchVisitsFromAPI();
    const interval = setInterval(fetchVisitsFromAPI, 3000);
    return () => clearInterval(interval);
  }, [fetchVisitsFromAPI]);

  // Real-time cross-tab sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'roomwati_scheduled_visits') {
        try {
          const updated = JSON.parse(e.newValue || '[]');
          if (Array.isArray(updated)) {
            setAllVisits(
              updated.filter(
                (v) =>
                  v.id !== 'visit-101' &&
                  v.id !== 'visit-102' &&
                  v.id !== 'visit-103'
              )
            );
          }
        } catch (err) {
          console.error('Failed to parse storage visits', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter visits scoped to the current user (either as tenant or host)
  const visits = allVisits
    .map((v) => {
      const hostEntity = v.host || {
        id: v.hostId || 'host',
        name: v.hostName || 'Property Host',
        email: v.hostEmail,
        phone: v.hostPhone,
      };

      const tenantEntity = v.tenant || {
        id: v.tenantId || 'tenant',
        name: v.tenantName || 'Tenant',
        phone: v.tenantPhone,
        email: v.tenantEmail,
      };

      const isHost = isUserMatch(hostEntity, user);
      const isTenant = isUserMatch(tenantEntity, user);

      if (!user && !isHost && !isTenant) return null;
      if (user && !isHost && !isTenant) return null;

      return {
        ...v,
        host: hostEntity,
        tenant: tenantEntity,
        hostName: hostEntity.name,
        hostPhone: hostEntity.phone,
        tenantName: tenantEntity.name,
        tenantPhone: tenantEntity.phone,
        isOwnerView: isHost,
      };
    })
    .filter(Boolean);

  const scheduleVisit = useCallback(
    (visitData) => {
      const newVisitId = `visit-${Date.now()}`;
      const tenantId = (user?._id || user?.id || user?.username || 'tenant')?.toString();
      const tenantName = visitData.tenantName || user?.username || 'Tenant';
      const tenantPhone = visitData.tenantPhone || user?.phone || '+91 98765 00000';
      const tenantEmail = user?.email || 'tenant@roomwati.com';

      const hostId = (visitData.hostId || 'host')?.toString();
      const hostName = visitData.hostName || 'Property Host';
      const hostEmail = visitData.hostEmail || 'host@roomwati.com';
      const hostPhone = visitData.hostPhone || '+91 98765 43210';

      const newVisit = {
        id: newVisitId,
        listingId: visitData.listingId || 'custom-listing',
        listingTitle: visitData.listingTitle || 'Verified Property Stay',
        listingLocation: visitData.listingLocation || 'Metro Hub, India',
        listingPrice: visitData.listingPrice || 15000,
        listingImage: visitData.listingImage || null,
        host: {
          id: hostId,
          name: hostName,
          email: hostEmail,
          phone: hostPhone,
        },
        hostId,
        hostName,
        hostPhone,
        hostEmail,
        tenant: {
          id: tenantId,
          name: tenantName,
          email: tenantEmail,
          phone: tenantPhone,
        },
        tenantId,
        tenantName,
        tenantPhone,
        tenantEmail,
        visitDate: visitData.visitDate,
        visitSlot: visitData.visitSlot || '11:00 AM',
        status: 'confirmed',
        notes: visitData.notes || '100% Free Zero-brokerage In-Person Visit',
        createdAt: Date.now(),
      };

      setAllVisits((prev) => [newVisit, ...prev]);

      // Save visit to backend API
      api.createVisit(newVisit).catch(() => {});

      // 1. Toast for current user
      toast.success(
        'Visit Scheduled! 📅',
        `Your visit for "${newVisit.listingTitle}" is confirmed for ${newVisit.visitDate} at ${newVisit.visitSlot}.`,
        {
          actionLabel: 'View My Visits',
          onAction: () => (window.location.href = '/visits?tab=upcoming'),
        }
      );

      // 2. Notification for Tenant
      addNotification({
        type: 'booking',
        title: `Visit Scheduled: ${newVisit.listingTitle}`,
        message: `Your visit with ${newVisit.hostName} is booked for ${newVisit.visitDate} at ${newVisit.visitSlot}.`,
        link: '/visits?tab=upcoming',
        category: 'alerts',
        badge: 'Scheduled',
        recipientId: tenantId,
        recipientUsername: tenantName,
        recipientEmail: tenantEmail,
      });

      // 3. Notification for Property Owner (Host)
      if (hostId && hostId !== 'host' && hostId !== tenantId) {
        addNotification({
          type: 'booking',
          title: `🔔 Host Alert: New Visit Request`,
          message: `${tenantName} (${tenantPhone}) booked a free visit for "${newVisit.listingTitle}" on ${newVisit.visitDate} at ${newVisit.visitSlot}.`,
          link: '/visits?tab=owner',
          category: 'activity',
          badge: 'Visit Request',
          recipientId: hostId,
          recipientUsername: hostName,
          recipientEmail: hostEmail,
        });
      }

      return newVisit;
    },
    [user, toast, addNotification]
  );

  const updateVisitStatus = useCallback(
    (visitId, newStatus) => {
      setAllVisits((prev) =>
        prev.map((v) => {
          if (v.id === visitId) {
            if (newStatus === 'confirmed') {
              addNotification({
                type: 'booking',
                title: `Visit Confirmed by Host! ✅`,
                message: `Host ${v.hostName || v.host?.name || 'Owner'} confirmed your visit for "${v.listingTitle}" on ${v.visitDate} at ${v.visitSlot}.`,
                link: '/visits?tab=upcoming',
                category: 'alerts',
                badge: 'Confirmed',
                recipientId: v.tenantId || v.tenant?.id,
                recipientUsername: v.tenantName || v.tenant?.name,
                recipientEmail: v.tenantEmail || v.tenant?.email,
              });
            } else if (newStatus === 'cancelled') {
              const isMeTenant = isUserMatch(v.tenant, user);
              const targetRecipient = isMeTenant
                ? v.host || { id: v.hostId, name: v.hostName, email: v.hostEmail }
                : v.tenant || { id: v.tenantId, name: v.tenantName, email: v.tenantEmail };

              addNotification({
                type: 'booking',
                title: `Visit Cancelled ❌`,
                message: `The scheduled visit for "${v.listingTitle}" on ${v.visitDate} at ${v.visitSlot} was cancelled.`,
                link: isMeTenant ? '/visits?tab=owner' : '/visits?tab=upcoming',
                category: 'alerts',
                badge: 'Cancelled',
                recipientId: targetRecipient?.id,
                recipientUsername: targetRecipient?.name,
                recipientEmail: targetRecipient?.email,
              });
            }
            return { ...v, status: newStatus };
          }
          return v;
        })
      );

      // Update in backend API
      api.updateVisitStatus(visitId, { status: newStatus }).catch(() => {});

      if (newStatus === 'confirmed') {
        toast.success('Visit Accepted! ✅', 'The visit has been confirmed and the tenant notified.');
      } else if (newStatus === 'cancelled') {
        toast.info('Visit Cancelled', 'The visit request has been cancelled.');
      }
    },
    [toast, addNotification]
  );

  const rescheduleVisit = useCallback(
    (visitId, newDate, newSlot) => {
      setAllVisits((prev) =>
        prev.map((v) => {
          if (v.id === visitId) {
            const isMeTenant = isUserMatch(v.tenant, user);
            const targetRecipient = isMeTenant ? v.host || { id: v.hostId, name: v.hostName, email: v.hostEmail } : v.tenant || { id: v.tenantId, name: v.tenantName, email: v.tenantEmail };

            addNotification({
              type: 'booking',
              title: `Visit Rescheduled 📅`,
              message: `Visit for "${v.listingTitle}" was updated to ${newDate} at ${newSlot}.`,
              link: isMeTenant ? '/visits?tab=owner' : '/visits?tab=upcoming',
              category: 'alerts',
              badge: 'Rescheduled',
              recipientId: targetRecipient?.id,
              recipientUsername: targetRecipient?.name,
              recipientEmail: targetRecipient?.email,
            });

            return { ...v, visitDate: newDate, visitSlot: newSlot, status: 'confirmed' };
          }
          return v;
        })
      );

      // Update in backend API
      api.updateVisitStatus(visitId, { date: newDate, time: newSlot }).catch(() => {});

      toast.success(
        'Visit Rescheduled 📅',
        `Updated to ${newDate} at ${newSlot}. Both parties have been notified.`
      );
    },
    [user, toast, addNotification]
  );

  const cancelVisit = useCallback(
    (visitId) => {
      updateVisitStatus(visitId, 'cancelled');
    },
    [updateVisitStatus]
  );

  const upcomingVisits = visits.filter(
    (v) => v.status === 'confirmed' || v.status === 'pending'
  );

  return (
    <VisitContext.Provider
      value={{
        visits,
        upcomingVisits,
        scheduleVisit,
        updateVisitStatus,
        rescheduleVisit,
        cancelVisit,
      }}
    >
      {children}
    </VisitContext.Provider>
  );
}

export function useVisits() {
  const context = useContext(VisitContext);
  if (!context) {
    throw new Error('useVisits must be used within a VisitProvider');
  }
  return context;
}
