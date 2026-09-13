import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Calendar,
  Phone,
  ShieldCheck,
  Trash2,
  Search,
  ArrowLeft,
  ExternalLink,
  Clock,
  Sparkles,
  CheckCheck,
  Home,
  User,
  MoreVertical,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useVisits } from '../context/VisitContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';

export default function Messages() {
  const {
    threads,
    activeThread,
    activeThreadId,
    selectThread,
    sendMessage,
    markThreadAsRead,
    deleteThread,
    totalUnreadMessages
  } = useChat();

  const { scheduleVisit } = useVisits();
  const toast = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'tenant', 'host'
  const [threadToDelete, setThreadToDelete] = useState(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const isNearBottomRef = useRef(true);
  const prevMessagesLengthRef = useRef(0);

  // Scroll ONLY the inner chat container to the bottom (prevent window scroll jumping)
  const scrollToBottom = (smooth = false) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  // Handle user scrolling inside the chat container
  const handleChatScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 120;
  };

  // When active thread changes, instantly scroll inner container to bottom and mark as read
  useEffect(() => {
    if (activeThreadId) {
      scrollToBottom(false);
      prevMessagesLengthRef.current = activeThread?.messages?.length || 0;
      markThreadAsRead(activeThreadId);
    }
  }, [activeThreadId, markThreadAsRead]);

  // If viewing active thread and a new incoming message arrives in it, mark as read immediately
  useEffect(() => {
    if (activeThread?.id && activeThread.unreadCount > 0) {
      markThreadAsRead(activeThread.id);
    }
  }, [activeThread?.id, activeThread?.unreadCount, markThreadAsRead]);

  // When messages update, only scroll if user was already at bottom or sent a message
  useEffect(() => {
    const currentLen = activeThread?.messages?.length || 0;
    if (currentLen > prevMessagesLengthRef.current) {
      if (isNearBottomRef.current) {
        scrollToBottom(true);
      }
      prevMessagesLengthRef.current = currentLen;
    }
  }, [activeThread?.messages]);

  // If thread ID specified in query params
  useEffect(() => {
    const threadParam = searchParams.get('id');
    if (threadParam) {
      selectThread(threadParam);
      setMobileShowChat(true);
    }
  }, [searchParams, selectThread]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !activeThread) return;

    sendMessage(activeThread.id, inputMessage.trim());
    setInputMessage('');
    isNearBottomRef.current = true;
    setTimeout(() => scrollToBottom(true), 50);
  };

  const handleQuickPrompt = (promptText) => {
    if (!activeThread) return;
    sendMessage(activeThread.id, promptText);
  };

  const handleQuickVisitPrompt = () => {
    if (!activeThread) return;
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const pName = activeThread.participant?.name || 'there';
    const visitText = `Hi ${pName}, I would like to schedule a free in-person visit for tomorrow (${tomorrow}) at 11:00 AM. Please confirm if this works for you!`;
    sendMessage(activeThread.id, visitText);
    toast.info('Visit Request Sent in Chat 📅', 'The host has been notified with your preferred time slot.');
  };

  const filteredThreads = (threads || []).filter((t) => {
    const query = (searchQuery || '').toLowerCase();
    const pName = t.participant?.name?.toLowerCase() || '';
    const lTitle = t.listingTitle?.toLowerCase() || '';
    const lastMsg = t.lastMessage?.toLowerCase() || '';
    return (
      pName.includes(query) ||
      lTitle.includes(query) ||
      lastMsg.includes(query)
    );
  });

  const quickPrompts = [
    'Is this room available immediately?',
    'What are the security deposit terms?',
    'Are electricity & Wi-Fi included?',
    'Can I schedule a visit tomorrow?',
    'Can you share the exact location pin?'
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
              <MessageSquare className="w-4 h-4" />
              <span>Direct In-App Messenger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              Conversations & Inquiries
              {totalUnreadMessages > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500 text-white shadow-sm">
                  {totalUnreadMessages} New
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/visits"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300"
            >
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>My Scheduled Visits</span>
            </Link>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm rounded-xl shadow-sm transition-all hover:shadow"
            >
              <Home className="w-4 h-4" />
              <span>Explore Listings</span>
            </Link>
          </div>
        </div>

        {/* Main Messenger Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row h-[740px]">
          {/* Left Sidebar: Threads List */}
          <div
            className={`w-full md:w-[380px] lg:w-[420px] border-r border-slate-100 flex flex-col bg-white flex-shrink-0 ${
              mobileShowChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Sidebar Header & Search */}
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search hosts or properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Threads Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2 space-y-1">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">No conversations found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Explore listings and click "Message Host" to start a chat!
                  </p>
                </div>
              ) : (
                filteredThreads.map((thread) => {
                  const isActive = activeThread?.id === thread.id;
                  return (
                    <div
                      key={thread.id}
                      onClick={() => {
                        selectThread(thread.id);
                        setMobileShowChat(true);
                      }}
                      className={`group relative p-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'bg-rose-50/70 border border-rose-200/60 shadow-sm'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <Avatar
                          src={thread.participant?.avatar}
                          name={thread.participant?.name || 'User'}
                          size="lg"
                          online={thread.participant?.online}
                        />

                        {/* Thread Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <h3
                                className={`text-sm font-bold truncate ${
                                  isActive ? 'text-rose-900' : 'text-slate-900'
                                }`}
                              >
                                {thread.participant?.name || 'User'}
                              </h3>
                              {thread.participant?.verified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              )}
                            </div>
                            <span className="text-[11px] font-medium text-slate-400 flex-shrink-0">
                              {thread.lastMessageTime}
                            </span>
                          </div>

                          <div className="inline-block max-w-full truncate px-2 py-0.5 bg-slate-100 group-hover:bg-slate-200/60 text-slate-600 text-[11px] font-medium rounded-md mb-1.5 transition-colors">
                            🏠 {thread.listingTitle || 'Listing Inquiry'}
                          </div>

                          <p
                            className={`text-xs truncate ${
                              thread.unreadCount > 0
                                ? 'font-semibold text-slate-900'
                                : 'text-slate-500'
                            }`}
                          >
                            {thread.lastMessage || 'No messages yet'}
                          </p>
                        </div>

                        {/* Unread badge & delete on hover */}
                        <div className="flex flex-col items-end justify-between self-stretch">
                          {thread.unreadCount > 0 ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                              {thread.unreadCount}
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setThreadToDelete(thread);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete conversation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane: Active Chat Window */}
          <div
            className={`flex-1 flex flex-col bg-slate-50/40 ${
              mobileShowChat ? 'flex' : 'hidden md:flex'
            }`}
          >
            {activeThread ? (
              <>
                {/* Active Chat Header */}
                <div className="p-4 sm:px-6 bg-white border-b border-slate-100 flex items-center justify-between gap-4 shadow-sm z-10">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => setMobileShowChat(false)}
                      className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <Avatar
                      src={activeThread.participant?.avatar}
                      name={activeThread.participant?.name || 'User'}
                      size="lg"
                      online={activeThread.participant?.online}
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-base font-bold text-slate-900 truncate">
                          {activeThread.participant?.name || 'User'}
                        </h2>
                        {activeThread.participant?.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60">
                            <ShieldCheck className="w-3 h-3" /> Verified Host
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate flex items-center gap-2">
                        <span>{activeThread.participant?.role || 'Host'}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">
                          {activeThread.participant?.online ? 'Online now' : 'Active today'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handleQuickVisitPrompt}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-xl border border-rose-200/80 transition-all shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule Visit</span>
                    </button>

                    <a
                      href={`tel:${activeThread.participant.phone}`}
                      className="p-2.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl border border-slate-200/80 transition-all"
                      title="Call Host"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => setThreadToDelete(activeThread)}
                      className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200/80 transition-all"
                      title="Delete thread"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Listing Banner Bar in Chat */}
                <div className="px-4 py-2.5 bg-white/90 border-b border-slate-100 flex items-center justify-between text-xs backdrop-blur-sm">
                  <div className="flex items-center gap-2.5 truncate">
                    {activeThread.listingImage ? (
                      <img
                        src={activeThread.listingImage}
                        alt={activeThread.listingTitle || 'Property'}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                    )}
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 truncate block">
                        {activeThread.listingTitle}
                      </span>
                      <span className="text-slate-500 font-medium">
                        ₹{activeThread.listingPrice?.toLocaleString()}/mo • {activeThread.listingLocation}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/listings/${activeThread.listingId}`}
                    className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold hover:underline flex-shrink-0 ml-3"
                  >
                    <span>View Property</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Messages Feed Area */}
                <div 
                  ref={chatContainerRef} 
                  onScroll={handleChatScroll}
                  className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
                >
                  {/* Safety note notice */}
                  <div className="max-w-md mx-auto p-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl text-center text-xs text-amber-800 shadow-xs flex items-center justify-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Always schedule visits and verify ID proofs before making any advance tokens.</span>
                  </div>

                  {activeThread.messages.map((msg, index) => {
                    return (
                      <div
                        key={msg.id || index}
                        className={`flex animate-fade-in ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-xs ${
                            msg.isMine
                              ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-br-none shadow-rose-500/10'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                          }`}
                        >
                          {!msg.isMine && (
                            <p className="text-[11px] font-bold text-rose-500 mb-0.5">
                              {msg.senderName}
                            </p>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                              msg.isMine ? 'text-rose-100' : 'text-slate-400'
                            }`}
                          >
                            <span>{msg.timestamp}</span>
                            {msg.isMine && <CheckCheck className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Suggestion Chips */}
                <div className="px-4 py-2 bg-white/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Quick Reply:
                  </span>
                  {quickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="px-3 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-medium rounded-full border border-slate-200/70 transition-all flex-shrink-0"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Message Input Box */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Message ${activeThread.participant.name}...`}
                    className="flex-1 px-4 py-3 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="p-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:hover:bg-rose-500 text-white rounded-2xl shadow-sm transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-rose-500 mb-4">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No conversation selected</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-6">
                  Pick a conversation from the sidebar to chat with owners, ask room details, or schedule verified visits.
                </p>
                <Link
                  to="/listings"
                  className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm rounded-xl shadow-sm transition-all"
                >
                  Browse Available Rooms
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Conversation Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(threadToDelete)}
        onClose={() => setThreadToDelete(null)}
        onConfirm={() => {
          if (threadToDelete) {
            deleteThread(threadToDelete.id);
            setThreadToDelete(null);
          }
        }}
        title="Delete Conversation?"
        itemName={threadToDelete?.participant?.name ? `Chat with ${threadToDelete.participant.name}` : threadToDelete?.listingTitle}
        itemType="conversation"
        message="Are you sure you want to delete this conversation? All chat messages in this thread will be permanently removed."
        confirmText="Yes, Delete Conversation"
      />
    </div>
  );
}
