import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';
import { useChat } from '../../context/ChatContext';
import { useVisits } from '../../context/VisitContext';
import {
  Bell,
  ChevronDown,
  User,
  Menu,
  X,
  Heart,
  PlusCircle,
  LogOut,
  MapPin,
  CheckCheck,
  Trash2,
  Calendar,
  Flame,
  ShieldCheck,
  Sparkles,
  FileText,
  ExternalLink,
  Clock,
  MessageSquare,
  CalendarDays
} from 'lucide-react';
import Avatar from './Avatar';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const { totalUnreadMessages } = useChat();
  const { upcomingVisits } = useVisits();
  const toast = useToast();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifTab, setNotifTab] = useState('all'); // 'all' | 'unread' | 'alerts'

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      toast.success('Logged Out', 'You have been logged out successfully. See you soon!');
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout Failed', 'An error occurred while logging out.');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Listings', path: '/listings' },
    ...(user ? [
      { name: 'Visits', path: '/visits', badge: upcomingVisits.length > 0 ? upcomingVisits.length : null },
      { name: 'Messages', path: '/messages', badge: totalUnreadMessages > 0 ? totalUnreadMessages : null },
    ] : []),
    { name: 'About', path: '/about' },
  ];

  const displayName = user?.username ? (user.username.split(' ')[0] || user.username) : 'User';

  const filteredNotifications = notifications.filter(n => {
    if (notifTab === 'unread') return !n.read;
    if (notifTab === 'alerts') return n.category === 'alerts' || n.type === 'price_drop' || n.type === 'booking';
    return true;
  });

  const getNotifIcon = (type) => {
    switch (type) {
      case 'booking':
        return <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Calendar className="w-4 h-4" /></div>;
      case 'price_drop':
        return <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#FE424D] flex items-center justify-center shrink-0"><Flame className="w-4 h-4" /></div>;
      case 'security':
        return <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><ShieldCheck className="w-4 h-4" /></div>;
      case 'agreement':
        return <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><FileText className="w-4 h-4" /></div>;
      case 'wishlist':
        return <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0"><Heart className="w-4 h-4 fill-pink-500" /></div>;
      case 'welcome':
      default:
        return <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4" /></div>;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* 1. BRAND LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#FE424D] flex items-center justify-center text-white shadow-md shadow-[#FE424D]/25 group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-white"
              >
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                <circle cx="12" cy="10" r="3" fill="white" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Room<span className="text-[#FE424D]">Wati</span>
            </span>
          </Link>

          {/* 2. DESKTOP CENTER NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path && !location.search;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-semibold transition-all relative py-1.5 flex items-center gap-1.5 ${isActive
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:scale-105'
                    }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black bg-[#FE424D] text-white flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FE424D] rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. RIGHT ACTIONS & USER PROFILE */}
          <div className="flex items-center gap-3">

            {/* Host CTA Button */}
            <Link
              to={isAuthenticated ? "/listings/new" : "/login?redirect=/listings/new"}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-slate-800 hover:bg-slate-100 transition-all active:scale-95"
            >
              <span>List Your Property</span>
            </Link>

            {/* Notification Bell & Dropdown (Only if authenticated) */}
            {user && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${notificationsOpen
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                    }`}
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FE424D] text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border border-slate-200/90 text-slate-800 z-50 overflow-hidden animate-modal-in text-left">

                    {/* Top Bar Header */}
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900">Notifications</h4>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[#FE424D] text-[10px] font-black animate-pulse">
                            {unreadCount} new
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[11px] font-bold text-slate-600 hover:text-[#FE424D] flex items-center gap-1 transition-colors"
                            title="Mark all as read"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Mark all read</span>
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAll}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                            title="Clear all notifications"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>


                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 px-4 pt-2.5 pb-2 border-b border-slate-100 bg-white text-xs font-bold text-slate-500">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'unread', label: `Unread (${unreadCount})` },
                        { id: 'alerts', label: 'Alerts & Deals' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setNotifTab(tab.id)}
                          className={`px-3 py-1 rounded-lg transition-all ${notifTab === tab.id
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'hover:bg-slate-100 text-slate-600'
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Notification Items List */}
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
                      {filteredNotifications.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 space-y-2">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                            <Bell className="w-5 h-5 opacity-60" />
                          </div>
                          <p className="text-xs font-bold text-slate-600">No notifications in this tab</p>
                          <p className="text-[11px] text-slate-400">You're all caught up!</p>
                        </div>
                      ) : (
                        filteredNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 rounded-2xl transition-all relative group flex items-start gap-3 cursor-pointer ${notif.read
                              ? 'bg-white hover:bg-slate-50/80 text-slate-700'
                              : 'bg-rose-50/40 hover:bg-rose-50/70 text-slate-900 border border-rose-100/60'
                              }`}
                            onClick={() => {
                              if (!notif.read) markAsRead(notif.id);
                              if (notif.link) {
                                setNotificationsOpen(false);
                                navigate(notif.link);
                              }
                            }}
                          >
                            {/* Type Icon */}
                            {getNotifIcon(notif.type)}

                            {/* Content */}
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <p className={`text-xs font-black truncate ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                  {notif.title}
                                </p>
                                {!notif.read && (
                                  <span className="w-2 h-2 rounded-full bg-[#FE424D] shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-1.5">
                                {notif.message}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                                <Clock className="w-3 h-3" />
                                <span>{notif.time}</span>
                                {notif.badge && (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase text-[9px]">
                                    {notif.badge}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Item Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity absolute right-2 top-2"
                              title="Dismiss"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-3 border-t border-slate-100 bg-slate-50/60 text-center">
                      <Link
                        to="/listings"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs font-bold text-[#FE424D] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Explore verified stays & updates</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown / Auth Button */}
            <div className="relative" ref={dropdownRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1 pl-1.5 pr-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm transition-all"
                >
                  <Avatar
                    src={user?.image?.url || (typeof user?.image === 'string' ? user.image : null)}
                    name={user?.username || 'User'}
                    size="sm"
                    shape="rounded-full"
                  />
                  <span className="text-xs font-bold truncate max-w-[110px]">
                    Hey, {displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs md:text-sm font-bold py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all duration-200"
                  >
                    Log in
                  </Link>
                </div>
              )}

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-floating border border-slate-100 py-2 text-slate-800 z-50 animate-fade-in text-left">
                  <div className="px-4 py-3 border-b border-slate-100 mb-1">
                    <p className="text-xs font-medium text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.email || 'user@roomwati.com'}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </Link>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3 animate-fade-in text-left">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FE424D] text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                to={isAuthenticated ? "/listings/new" : "/login?redirect=/listings/new"}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#FE424D] hover:bg-rose-50 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Your Property</span>
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/visits"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Scheduled Visits</span>
                    </div>
                    {upcomingVisits.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                        {upcomingVisits.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Messages</span>
                    </div>
                    {totalUnreadMessages > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FE424D] text-white">
                        {totalUnreadMessages}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}

      </div>
    </header>
  );
}

