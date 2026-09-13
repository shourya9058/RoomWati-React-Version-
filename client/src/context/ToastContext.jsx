import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  Heart, 
  X, 
  Sparkles,
  ExternalLink,
  BellRing,
  ArrowRight
} from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [leavingIds, setLeavingIds] = useState(new Set());
  const timersRef = useRef(new Map());

  const removeToastImmediate = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    setLeavingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (timersRef.current.has(id)) {
      clearTimeout(timersRef.current.get(id));
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss = useCallback((id) => {
    setLeavingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      removeToastImmediate(id);
    }, 320);
  }, [removeToastImmediate]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration ?? 4000;

    const newToast = {
      id,
      type: toast.type || 'info', // 'success' | 'error' | 'info' | 'warning' | 'wishlist' | 'notification'
      title: toast.title,
      message: toast.message,
      actionLabel: toast.actionLabel,
      onAction: toast.onAction,
      icon: toast.icon,
      badge: toast.badge,
      duration,
      createdAt: Date.now(),
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep max 4 toasts

    if (duration > 0) {
      const timer = setTimeout(() => {
        dismiss(id);
      }, duration);
      timersRef.current.set(id, timer);
    }

    return id;
  }, [dismiss]);

  const success = useCallback((title, message, options = {}) => {
    return addToast({ type: 'success', title, message, ...options });
  }, [addToast]);

  const error = useCallback((title, message, options = {}) => {
    return addToast({ type: 'error', title, message, ...options });
  }, [addToast]);

  const info = useCallback((title, message, options = {}) => {
    return addToast({ type: 'info', title, message, ...options });
  }, [addToast]);

  const warning = useCallback((title, message, options = {}) => {
    return addToast({ type: 'warning', title, message, ...options });
  }, [addToast]);

  const wishlist = useCallback((isAdded, propertyTitle, options = {}) => {
    return addToast({
      type: 'wishlist',
      title: isAdded ? 'Saved to Wishlist' : 'Removed from Wishlist',
      message: propertyTitle 
        ? (isAdded ? `"${propertyTitle}" saved for easy comparison.` : `"${propertyTitle}" removed from saved stays.`)
        : (isAdded ? 'Property saved to your wishlist.' : 'Property removed from wishlist.'),
      badge: isAdded ? 'Wishlist ❤️' : 'Removed',
      ...options,
    });
  }, [addToast]);

  const notification = useCallback((title, message, options = {}) => {
    return addToast({ type: 'notification', title, message, ...options });
  }, [addToast]);

  const handleMouseEnter = (id) => {
    if (timersRef.current.has(id)) {
      clearTimeout(timersRef.current.get(id));
      timersRef.current.delete(id);
    }
  };

  const handleMouseLeave = (id, duration = 2500) => {
    if (!leavingIds.has(id)) {
      const timer = setTimeout(() => {
        dismiss(id);
      }, duration);
      timersRef.current.set(id, timer);
    }
  };

  const getAccentConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          bar: 'bg-emerald-500',
          iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
          icon: <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />,
          defaultBadge: 'Success',
          badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        };
      case 'error':
        return {
          bar: 'bg-rose-500',
          iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
          icon: <AlertCircle className="w-4 h-4 stroke-[2.5]" />,
          defaultBadge: 'Notice',
          badgeStyle: 'bg-rose-50 text-rose-700 border-rose-100',
        };
      case 'wishlist':
        return {
          bar: 'bg-[#FE424D]',
          iconBg: 'bg-gradient-to-tr from-[#FE424D] to-rose-400 text-white shadow-md shadow-rose-500/25',
          icon: <Heart className="w-4 h-4 fill-white stroke-none" />,
          defaultBadge: 'Saved ❤️',
          badgeStyle: 'bg-rose-50 text-[#FE424D] border-rose-100',
        };
      case 'warning':
        return {
          bar: 'bg-amber-500',
          iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
          icon: <AlertTriangle className="w-4 h-4 stroke-[2.5]" />,
          defaultBadge: 'Alert',
          badgeStyle: 'bg-amber-50 text-amber-700 border-amber-100',
        };
      case 'notification':
      default:
        return {
          bar: 'bg-[#FE424D]',
          iconBg: 'bg-rose-50 text-[#FE424D] border border-rose-100',
          icon: <BellRing className="w-4 h-4 stroke-[2.5]" />,
          defaultBadge: 'Update',
          badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, dismiss, success, error, info, warning, wishlist, notification }}>
      {children}
      
      {/* Floating Smooth White UI Popups Container */}
      <div 
        className="fixed top-5 right-5 z-[999999] flex flex-col gap-3 max-w-[380px] sm:max-w-[420px] w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => {
          const isLeaving = leavingIds.has(t.id);
          const config = getAccentConfig(t.type);

          return (
            <div
              key={t.id}
              onMouseEnter={() => handleMouseEnter(t.id)}
              onMouseLeave={() => handleMouseLeave(t.id, t.duration)}
              className={`pointer-events-auto w-full rounded-3xl p-4 sm:p-4.5 bg-white/98 backdrop-blur-2xl border border-slate-200/90 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.12),0_8px_20px_-4px_rgba(15,23,42,0.06)] text-slate-900 relative overflow-hidden transition-all duration-300 group ${
                isLeaving ? 'animate-toast-out' : 'animate-toast-in'
              }`}
            >
              {/* Subtle Ambient Light Gradient in Card Corner */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-rose-50/60 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-start gap-3.5">
                
                {/* Icon Badge */}
                <div className="shrink-0 pt-0.5">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${config.iconBg} transition-transform group-hover:scale-105 duration-200`}>
                    {t.icon || config.icon}
                  </div>
                </div>

                {/* Body Text */}
                <div className="flex-1 min-w-0 pr-1 text-left">
                  
                  {/* Top Header Row with Badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[13px] sm:text-sm font-black text-slate-900 tracking-tight leading-snug truncate">
                      {t.title}
                    </h4>
                    
                    <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${config.badgeStyle}`}>
                      {t.badge || config.defaultBadge}
                    </span>
                  </div>

                  {/* Message */}
                  {t.message && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {t.message}
                    </p>
                  )}

                  {/* Action Link Button */}
                  {t.actionLabel && t.onAction && (
                    <div className="pt-2.5">
                      <button
                        onClick={() => {
                          t.onAction();
                          dismiss(t.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-[11px] shadow-sm shadow-[#FE424D]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>{t.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                </div>

                {/* Close Button */}
                <button
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors -mr-1 -mt-1"
                  aria-label="Dismiss message"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

              </div>

              {/* Countdown Progress Line at Bottom */}
              {t.duration > 0 && !isLeaving && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full ${config.bar} transition-all opacity-85`}
                    style={{
                      animation: `shrinkProgressBar ${t.duration}ms linear forwards`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
