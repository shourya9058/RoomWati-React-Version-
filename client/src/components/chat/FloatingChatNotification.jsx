import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, X, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Avatar from '../common/Avatar';

export default function FloatingChatNotification() {
  const { user } = useAuth();
  const { incomingAlert, dismissIncomingAlert, selectThread } = useChat();
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(100);

  // If user is not logged in or already on /messages with the same thread open, don't show the popup
  const isOnMessages = location.pathname === '/messages';

  useEffect(() => {
    if (!incomingAlert || isOnMessages) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const duration = 7000; // 7 seconds
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          dismissIncomingAlert();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [incomingAlert, isOnMessages, dismissIncomingAlert]);

  if (!user || !incomingAlert || isOnMessages) return null;

  const handleOpenChat = (e) => {
    e.stopPropagation();
    selectThread(incomingAlert.threadId);
    dismissIncomingAlert();
    navigate(`/messages?id=${incomingAlert.threadId}`);
  };

  return (
    <div className="fixed top-24 right-4 sm:right-6 z-[9999] max-w-sm sm:max-w-md w-full animate-bounce-short">
      <div 
        onClick={handleOpenChat}
        className="relative overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.25)] p-4 cursor-pointer group hover:border-[#FE424D]/40 transition-all duration-300"
      >
        {/* Top Header Tag */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FE424D] flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              New Message
            </span>
            <span className="text-[10px] font-semibold text-slate-400">• Just now</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissIncomingAlert();
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sender Info & Content */}
        <div className="flex items-start gap-3">
          <Avatar
            src={incomingAlert.senderAvatar}
            name={incomingAlert.senderName}
            size="md"
            shape="rounded-full"
            online={true}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-sm font-black text-slate-900 truncate">
                {incomingAlert.senderName}
              </h4>
            </div>

            {incomingAlert.listingTitle && (
              <p className="text-[11px] font-medium text-slate-500 truncate mb-1">
                Regarding: <span className="font-semibold text-slate-700">{incomingAlert.listingTitle}</span>
              </p>
            )}

            <p className="text-xs text-slate-700 font-medium bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 line-clamp-2 mt-0.5">
              "{incomingAlert.text}"
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
          <span className="text-[11px] text-slate-400 font-medium">Click anywhere to reply</span>
          <button
            onClick={handleOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FE424D] hover:bg-[#E0323D] text-white text-xs font-extrabold shadow-sm group-hover:shadow-md transition-all"
          >
            <span>Open Chat</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Timeout Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-[#FE424D] to-rose-400 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
